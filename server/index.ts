import express from 'express';
import cors from 'cors';
import { config } from './config';
import weatherRouter from './routes/weather';

const ALLOWED_ORIGINS = [
  'https://toy.lion1ou.tech',
  'http://127.0.0.1:9091',
  'http://localhost:9091',
];

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // 允许无 Origin 的请求（如 utools preload.js / curl / PM2 health check）
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    methods: ['POST', 'GET'],
  }),
);
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/', weatherRouter);

app.get('/health', (_req, res) => {
  res.json({ code: 0, message: 'ok', timestamp: Date.now() });
});

app.listen(config.port, '127.0.0.1', () => {
  console.log(`[server] running on http://127.0.0.1:${config.port} (${config.nodeEnv})`);
});
