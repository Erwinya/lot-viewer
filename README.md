# lot-viewer

Browser viewer for **lot / inspection CSV** metrics with **MAD outlier** flags.

Repository: [Erwinya/lot-viewer](https://github.com/Erwinya/lot-viewer)

Companion CLI: [lot-metrics](https://github.com/Erwinya/lot-metrics)

## Features

- Upload CSV or load the bundled sample
- Aggregate by `lot_id` + `metric` (count, min, max, mean, stdev)
- Modified z-score (MAD) outlier detection with adjustable sigma
- Sparkline + point table for the selected series
- Export summary JSON (compatible shape with `lot-metrics --json`)

## CSV columns

```text
timestamp,lot_id,metric,value
```

## Run

```bash
npm install
npm run dev
```

Windows PowerShell:

```powershell
npm install
npm run dev
```

Open http://localhost:5175

## Build / test

```bash
npm test
npm run build
```

## License

MIT
