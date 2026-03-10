import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import weatherRouter from './routes/weather';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api', weatherRouter);

app.get('/api/health', (_req, res) => {
  res.json({ code: 0, message: 'ok', timestamp: Date.now() });
});

if (config.nodeEnv === 'production') {
  const distPath = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(config.port, () => {
  console.log(`[server] running on http://127.0.0.1:${config.port} (${config.nodeEnv})`);
});
