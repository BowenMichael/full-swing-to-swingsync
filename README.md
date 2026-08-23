# Full Swing to SwingSync CSV Extractor ⛳

A modern, mobile-responsive web application built with **React (TypeScript)** and **Node.js (Express + TypeScript)** to extract golf launch monitor session data from Full Swing Golf share links and generate standardized, import-ready CSVs for **SwingSync**.

---

## Features

- **Direct Cloud Telemetry Extraction**: Direct AWS AppSync SigV4 integration via AWS Cognito Identity Pools. Extracts full launch monitor sessions without browser automation.
- **SwingSync Formatted CSVs**: Standardized CSV export including `Club`, `Club Speed`, `Ball Speed`, `Smash Factor`, `Carry Distance`, `Total Distance`, `Launch Angle`, `Launch Direction`, `Spin Rate`, `Spin Axis`, `Club Path`, `Face Angle`, `Face to Path`, `Attack Angle`, `Apex`, and `Descent Angle`.
- **Mobile-Responsive UI**: Dark golf-analytics design system with one-tap clipboard paste, club filter pills, per-club averages grid, and interactive sortable shot tables.
- **Multiple Export Formats**:
  - **SwingSync CSV** (Standardized for import)
  - **Raw Full Swing CSV** (All simulator parameters and validity flags)
  - **Raw JSON** (Full telemetry with 3D polynomial trajectory fit coefficients `xFit`, `yFit`, `zFit`)
- **Render Deployment Ready**: Preconfigured with `render.yaml`, `Procfile`, and full-stack production build scripts.

---

## Deploying to Render

### Method 1: Blueprint Deployment (Recommended)
1. Push this repository to GitHub / GitLab.
2. Log into [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** > **Blueprint**.
4. Connect your repository. Render will automatically detect `render.yaml` and configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Apply** to deploy!

### Method 2: Manual Web Service
1. Click **New +** > **Web Service**.
2. Connect your repository.
3. Configure the following settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Click **Deploy Web Service**.

---

## Local Development

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Run in Development Mode
Starts the Vite React dev server on `http://localhost:3000` and the Express API server on `http://localhost:3001` with hot-reloading:
```bash
npm run dev
```

### Build & Run Production Bundle
```bash
npm run build
npm start
```
Open `http://localhost:3001` in your browser.

---

## API Reference

### `POST /api/extract`
Extracts and parses session telemetry from a Full Swing share URL or UUID.
```json
// Request
{
  "url": "https://myfullswinggolf.com/lm/share/5c6af3dc-9e48-412b-a041-a41726b25956"
}
```

### `GET /api/export/swingsync?url=...`
Direct download for SwingSync CSV file.

### `GET /api/export/raw?url=...`
Direct download for Full Swing raw CSV dump.

### `GET /api/export/json?url=...`
Direct download for Full Swing raw JSON data.

---

## License
MIT
