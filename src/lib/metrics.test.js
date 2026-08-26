import { describe, expect, it } from "vitest";
import { aggregate, parseCsv } from "./metrics.js";

const sample = `timestamp,lot_id,metric,value
2026-08-05T08:00:00Z,LOT-1001,thickness_um,100.2
2026-08-05T08:05:00Z,LOT-1001,thickness_um,100.8
2026-08-05T08:10:00Z,LOT-1001,thickness_um,101.1
2026-08-05T08:15:00Z,LOT-1001,thickness_um,99.9
2026-08-05T08:20:00Z,LOT-1001,thickness_um,128.5
`;

describe("metrics", () => {
  it("parses CSV and flags MAD outliers", () => {
    const readings = parseCsv(sample);
    expect(readings).toHaveLength(5);
    const series = aggregate(readings, 3.5);
    expect(series).toHaveLength(1);
    expect(series[0].lotId).toBe("LOT-1001");
    expect(series[0].outliers.length).toBeGreaterThan(0);
    expect(series[0].outliers.some((o) => o.value === 128.5)).toBe(true);
  });
});
