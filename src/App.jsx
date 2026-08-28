import { useEffect, useMemo, useState } from "react";
import { aggregate, parseCsv, summarize } from "./lib/metrics.js";
import { summaryExportFilename } from "./lib/export.js";
import SeriesTable from "./components/SeriesTable.jsx";
import SeriesDetail from "./components/SeriesDetail.jsx";
import "./App.css";

export default function App() {
  const [rawText, setRawText] = useState("");
  const [sourceLabel, setSourceLabel] = useState("");
  const [sigma, setSigma] = useState(3.5);
  const [error, setError] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  const { series, parseError } = useMemo(() => {
    if (!rawText) return { series: [], parseError: "" };
    try {
      if (sigma <= 0) {
        throw new Error("Sigma must be greater than 0");
      }
      const readings = parseCsv(rawText);
      return { series: aggregate(readings, sigma), parseError: "" };
    } catch (err) {
      return { series: [], parseError: err.message || String(err) };
    }
  }, [rawText, sigma]);

  const summary = useMemo(() => summarize(series), [series]);

  useEffect(() => {
    if (!series.length) {
      setSelectedKey("");
      return;
    }
    const exists = series.some((s) => `${s.lotId}||${s.metric}` === selectedKey);
    if (!exists) {
      setSelectedKey(`${series[0].lotId}||${series[0].metric}`);
    }
  }, [series, selectedKey]);

  const selected = series.find((s) => `${s.lotId}||${s.metric}` === selectedKey) || null;

  async function loadSample() {
    setError("");
    try {
      const res = await fetch("/samples/readings.csv");
      if (!res.ok) throw new Error("Could not load sample CSV");
      const text = await res.text();
      parseCsv(text); // validate early
      setRawText(text);
      setSourceLabel("samples/readings.csv");
    } catch (err) {
      setError(err.message || String(err));
    }
  }

  function onFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        parseCsv(text);
        setRawText(text);
        setSourceLabel(file.name);
        setError("");
      } catch (err) {
        setError(err.message || String(err));
      }
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsText(file);
  }

  function exportJson() {
    const payload = {
      sigma,
      source: sourceLabel || "uploaded.csv",
      series: series.map(({ points, ...rest }) => ({
        ...rest,
        // keep outliers; drop full points from export for parity with lot-metrics JSON
      })),
    };
    // include outliers already on rest; points stripped
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = summaryExportFilename();
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <header className="top">
        <div>
          <p className="kicker">Lot Viewer</p>
          <h1>Inspect lot metrics and MAD outliers</h1>
          <p className="lede">
            Load a CSV (<code className="mono">timestamp, lot_id, metric, value</code>) and
            review aggregates with modified z-score flags — same idea as{" "}
            <code className="mono">lot-metrics</code>, in the browser.
          </p>
        </div>
      </header>

      <section className="panel controls">
        <div className="control-row">
          <label className="file-btn btn">
            Upload CSV
            <input type="file" accept=".csv,text/csv" onChange={onFile} hidden />
          </label>
          <button type="button" className="btn subtle" onClick={loadSample}>
            Load sample
          </button>
          <button type="button" className="btn subtle" onClick={exportJson} disabled={!series.length}>
            Export JSON
          </button>
          <label className="sigma">
            Sigma
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={sigma}
              onChange={(e) => setSigma(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="status-row">
          <span className="mono muted">
            {sourceLabel
              ? `${sourceLabel} · series=${summary.seriesCount} · outliers=${summary.outlierPoints}`
              : "No file loaded"}
          </span>
          {error || parseError ? <span className="error">{error || parseError}</span> : null}
        </div>
      </section>

      <main className="layout">
        <SeriesTable series={series} selectedKey={selectedKey} onSelect={setSelectedKey} />
        <SeriesDetail series={selected} />
      </main>
    </div>
  );
}
