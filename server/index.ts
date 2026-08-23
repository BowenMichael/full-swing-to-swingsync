import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { fetchFullSwingData, extractShareId } from './extractor.js';
import { parseSessionData, generateSwingSyncCsv, generateTrackmanCsv, generateRawCsv } from './exporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable trust proxy for Render load balancers
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// API: Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: Extract session data
app.post('/api/extract', async (req: Request, res: Response) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url) {
      return res.status(400).json({ error: 'Please provide a Full Swing share URL or Session ID.' });
    }

    const rawData = await fetchFullSwingData(url);
    const parsed = parseSessionData(rawData);

    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during extraction.';
    console.error('Extraction error:', message);
    return res.status(500).json({ error: message });
  }
});

// API: Export SwingSync CSV
app.get('/api/export/swingsync', async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).send('Missing url parameter.');
    }

    const shareId = extractShareId(url);
    const rawData = await fetchFullSwingData(url);
    const parsed = parseSessionData(rawData);
    const csvContent = generateSwingSyncCsv(parsed);

    const dateStr = parsed.session.startTimestamp
      ? new Date(parsed.session.startTimestamp * 1000).toISOString().split('T')[0]
      : 'session';
    const filename = `swingsync_${dateStr}_${shareId.substring(0, 8)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csvContent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Export failed.';
    console.error('SwingSync export error:', message);
    return res.status(500).send(`Error: ${message}`);
  }
});

// API: Export Trackman CSV
app.get('/api/export/trackman', async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).send('Missing url parameter.');
    }

    const shareId = extractShareId(url);
    const rawData = await fetchFullSwingData(url);
    const parsed = parseSessionData(rawData);
    const csvContent = generateTrackmanCsv(parsed);

    const dateStr = parsed.session.startTimestamp
      ? new Date(parsed.session.startTimestamp * 1000).toISOString().split('T')[0]
      : 'session';
    const filename = `trackman_${dateStr}_${shareId.substring(0, 8)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csvContent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Export failed.';
    console.error('Trackman export error:', message);
    return res.status(500).send(`Error: ${message}`);
  }
});

// API: Export Raw CSV
app.get('/api/export/raw', async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).send('Missing url parameter.');
    }

    const shareId = extractShareId(url);
    const rawData = await fetchFullSwingData(url);
    const parsed = parseSessionData(rawData);
    const csvContent = generateRawCsv(parsed);

    const filename = `fullswing_raw_${shareId.substring(0, 8)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(csvContent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Export failed.';
    console.error('Raw export error:', message);
    return res.status(500).send(`Error: ${message}`);
  }
});

// API: Export Raw JSON
app.get('/api/export/json', async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).send('Missing url parameter.');
    }

    const shareId = extractShareId(url);
    const rawData = await fetchFullSwingData(url);
    const filename = `fullswing_session_${shareId.substring(0, 8)}.json`;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(JSON.stringify(rawData, null, 2));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Export failed.';
    console.error('JSON export error:', message);
    return res.status(500).send(`Error: ${message}`);
  }
});

// Serve frontend static build in production
const clientBuildPath = path.resolve(process.cwd(), 'dist/client');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`⛳ Full Swing -> SwingSync Server running on http://localhost:${PORT}`);
});
