export default function SeriesTable({ series, selectedKey, onSelect }) {
  if (!series.length) {
    return (
      <div className="panel empty">
        <h2>Series</h2>
        <p className="muted">Load a CSV to see lot/metric aggregates.</p>
      </div>
    );
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Series</h2>
        <p className="muted mono">{series.length} group{series.length === 1 ? "" : "s"}</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Lot</th>
              <th>Metric</th>
              <th>n</th>
              <th>min</th>
              <th>max</th>
              <th>mean</th>
              <th>stdev</th>
              <th>outliers</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => {
              const key = `${s.lotId}||${s.metric}`;
              const active = key === selectedKey;
              return (
                <tr
                  key={key}
                  className={active ? "active" : ""}
                  onClick={() => onSelect(key)}
                >
                  <td className="mono">{s.lotId}</td>
                  <td className="mono">{s.metric}</td>
                  <td>{s.count}</td>
                  <td>{s.minimum.toFixed(3)}</td>
                  <td>{s.maximum.toFixed(3)}</td>
                  <td>{s.mean.toFixed(3)}</td>
                  <td>{s.stdev.toFixed(3)}</td>
                  <td>
                    <span className={s.outliers.length ? "pill warn" : "pill ok"}>
                      {s.outliers.length}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
