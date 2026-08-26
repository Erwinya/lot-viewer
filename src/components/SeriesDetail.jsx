import Sparkline from "./Sparkline.jsx";

export default function SeriesDetail({ series }) {
  if (!series) {
    return (
      <div className="panel empty">
        <h2>Detail</h2>
        <p className="muted">Select a series row to inspect points and outliers.</p>
      </div>
    );
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>
          <span className="mono">{series.lotId}</span> ·{" "}
          <span className="mono">{series.metric}</span>
        </h2>
        <p className="muted">
          {series.count} points · {series.outliers.length} outlier
          {series.outliers.length === 1 ? "" : "s"}
        </p>
      </div>
      <Sparkline points={series.points} />
      <div className="table-wrap tight">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Value</th>
              <th>z</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {series.points.map((p) => (
              <tr key={`${p.timestamp}-${p.value}`} className={p.outlier ? "outlier-row" : ""}>
                <td className="mono muted">{p.timestamp}</td>
                <td>{p.value}</td>
                <td className="mono">{p.z}</td>
                <td>{p.outlier ? <span className="pill warn">OUTLIER</span> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
