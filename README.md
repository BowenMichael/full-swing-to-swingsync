# Full Swing to SwingSync & Trackman CSV Extractor ⛳

A modern, mobile-responsive web application built with **React (TypeScript)** and **Node.js (Express + TypeScript)** to extract golf launch monitor session data from Full Swing Golf share links and generate standardized, import-ready CSVs for **SwingSync** and **Trackman**.

---

## Features

- **Direct Cloud Telemetry Extraction**: Direct AWS AppSync SigV4 integration via AWS Cognito Identity Pools. Extracts full launch monitor sessions without browser automation.
- **SwingSync Formatted CSVs**: Standardized CSV export including `Club`, `Club Speed`, `Ball Speed`, `Smash Factor`, `Carry Distance`, `Total Distance`, `Launch Angle`, `Launch Direction`, `Spin Rate`, `Spin Axis`, `Club Path`, `Face Angle`, `Face to Path`, `Attack Angle`, `Apex`, and `Descent Angle`.
- **Trackman Formatted CSVs**: Grouped Trackman schema (*Speed & Efficiency, Club Delivery, Launch & Spin, Distance, Dispersion, Ball Flight, Impact, Other*).
- **Mobile-Responsive UI**: Dark golf-analytics design system with one-tap clipboard paste, club filter pills, per-club averages grid, and interactive sortable shot tables.
- **Multiple Export Formats**:
  - **SwingSync CSV** (Standardized for SwingSync import)
  - **Trackman CSV** (Grouped Trackman launch monitor schema)
  - **Raw Full Swing CSV** (All simulator parameters and validity flags)
  - **Raw JSON** (Full telemetry with 3D polynomial trajectory fit coefficients `xFit`, `yFit`, `zFit`)
- **Google Analytics 4 (GA4) Ready**: Built-in GA4 integration with custom event tracking (`extract_session`, `download_session_data`, `filter_club`). Traffic and stats remain private to the owner.
- **Render Deployment Ready**: Preconfigured with `render.yaml`, `Procfile`, and full-stack production build scripts.

---

## 📲 How to Import CSV into SwingSync (By Platform)

### 📱 iOS (iPhone / iPad)
1. **Download**: Tap the green **"SwingSync CSV"** button (Safari will save the file to your device's **Files** app under `Downloads`).
2. **Open SwingSync**: Launch the SwingSync app or visit [swingsync.com](https://swingsync.com).
3. **Import**: Navigate to **Sessions** ➔ Tap **Import CSV / Upload** ➔ Choose the downloaded `swingsync_*.csv` file from your **Files** app.
4. **Done**: Your shot shapes, speeds, carry distances, and club performance will populate immediately.

### 🤖 Android
1. **Download**: Tap **"SwingSync CSV"** (saves into your Android `Downloads` folder).
2. **Open SwingSync**: Open the SwingSync app or mobile web dashboard.
3. **Import**: Go to **Sessions** ➔ Tap **Import Session** ➔ Select the CSV from your `Downloads` directory.

### 💻 Desktop (Mac / Windows PC)
1. **Download**: Click **"SwingSync CSV"** to save to your computer.
2. **Open Dashboard**: Go to [swingsync.com](https://swingsync.com) and log into your account.
3. **Upload**: Navigate to **Sessions / Shot Table** ➔ Drag and drop or upload your `swingsync_*.csv` file.

---

## Deploying to Render

### Method 1: Blueprint Deployment (Recommended)
1. Push this repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** > **Blueprint**.
4. Connect your repository (`BowenMichael/full-swing-to-swingsync`). Render will automatically detect `render.yaml` and configure the service.
5. *(Optional)* Add your Google Analytics Measurement ID in Render Environment Variables:
   - Key: `VITE_GA_MEASUREMENT_ID`
   - Value: `G-XXXXXXXXXX`
6. Click **Apply** to deploy!

---

## Local Development

### Installation
```bash
npm install
```

### Run in Development Mode
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

## Google Analytics 4 (GA4) Setup
To enable private traffic and event tracking in your Google Analytics account:
1. Create a GA4 property in [analytics.google.com](https://analytics.google.com/).
2. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`).
3. Set `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in your environment variables on Render (or in a local `.env` file).

All traffic, pageviews, and custom events (`extract_session`, `download_session_data`) will stream directly to your private Google Analytics dashboard.

---

## License
MIT
