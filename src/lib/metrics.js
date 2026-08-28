/**
 * CSV parse + MAD outlier aggregation (aligned with lot-metrics Python tool).
 */

export function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    throw new Error("CSV must include a header and at least one data row");
  }

  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const required = ["timestamp", "lot_id", "metric", "value"];
  for (const col of required) {
    if (!headers.includes(col)) {
      throw new Error(`CSV must include columns: ${required.join(", ")}`);
    }
  }

  const idx = Object.fromEntries(required.map((c) => [c, headers.indexOf(c)]));
  const readings = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const timestamp = cells[idx.timestamp]?.trim();
    const lotId = cells[idx.lot_id]?.trim();
    const metric = cells[idx.metric]?.trim();
    const rawValue = cells[idx.value]?.trim();
    if (!timestamp || !lotId || !metric || rawValue === undefined) {
      throw new Error(`line ${i + 1}: incomplete row`);
    }
    const value = Number(rawValue);
    if (!Number.isFinite(value)) {
      throw new Error(`line ${i + 1}: bad value ${rawValue}`);
    }
    const ts = Date.parse(timestamp);
    if (Number.isNaN(ts)) {
      throw new Error(`line ${i + 1}: bad timestamp ${timestamp}`);
    }
    readings.push({
      timestamp: new Date(ts).toISOString(),
      lotId,
      metric,
      value,
    });
  }
  if (!readings.length) throw new Error("no readings found");
  return readings;
}

function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function median(values) {
  const ordered = [...values].sort((a, b) => a - b);
  const n = ordered.length;
  const mid = Math.floor(n / 2);
  if (n % 2) return ordered[mid];
  return (ordered[mid - 1] + ordered[mid]) / 2;
}

function stdev(values, mean) {
  if (values.length < 2) return 0;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function modifiedZ(values) {
  if (values.length < 2) return values.map(() => 0);
  const med = median(values);
  const deviations = values.map((v) => Math.abs(v - med));
  const mad = median(deviations);
  if (mad === 0) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sd = stdev(values, mean);
    if (sd === 0) return values.map(() => 0);
    return values.map((v) => Math.abs(v - mean) / sd);
  }
  return values.map((v) => (0.6745 * Math.abs(v - med)) / mad);
}

export function aggregate(readings, sigma = 3.5) {
  if (sigma <= 0) {
    throw new Error("Sigma must be greater than 0");
  }
  const buckets = new Map();
  for (const r of readings) {
    const key = `${r.lotId}||${r.metric}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(r);
  }

  const series = [];
  for (const [key, items] of [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const [lotId, metric] = key.split("||");
    const values = items.map((r) => r.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sd = stdev(values, mean);
    const scores = modifiedZ(values);
    const outliers = [];
    const points = items.map((r, i) => {
      const z = scores[i];
      const flagged = z > sigma;
      if (flagged) {
        outliers.push({ timestamp: r.timestamp, value: r.value, z: Number(z.toFixed(3)) });
      }
      return { ...r, z: Number(z.toFixed(3)), outlier: flagged };
    });
    series.push({
      lotId,
      metric,
      count: values.length,
      minimum: Math.min(...values),
      maximum: Math.max(...values),
      mean: Number(mean.toFixed(4)),
      stdev: Number(sd.toFixed(4)),
      outliers,
      points,
    });
  }
  return series;
}

export function summarize(series) {
  return {
    seriesCount: series.length,
    outlierPoints: series.reduce((acc, s) => acc + s.outliers.length, 0),
    flaggedSeries: series.filter((s) => s.outliers.length > 0).length,
  };
}
