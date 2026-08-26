import { describe, expect, it } from "vitest";
import { summaryExportFilename } from "./export.js";

describe("summaryExportFilename", () => {
  it("includes the local calendar date in the export filename", () => {
    const date = new Date(2026, 7, 26, 23, 45);

    expect(summaryExportFilename(date)).toBe("lot-summary-2026-08-26.json");
  });
});
