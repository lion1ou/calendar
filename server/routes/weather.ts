import { Router, Request, Response } from 'express';
import { fetchNowWeather, getCityInfo } from '../services/weather';

const router = Router();

router.post('/weather', async (req: Request, res: Response) => {
  const { city } = req.body || {};

  if (!city || typeof city !== 'string') {
    return res.json({ code: -1, message: '缺少参数 city' });
  }

  if (!getCityInfo(city)) {
    return res.json({ code: -1, message: `城市 ${city} 不存在` });
  }

  try {
    const data = await fetchNowWeather(city);
    if (data) {
      return res.json({ code: 0, data });
    }
    return res.json({ code: -1, message: '天气数据获取失败，所有服务均不可用' });
  } catch (error) {
    console.error('[weather]', error);
    return res.json({ code: -1, message: (error as Error).message || '服务器内部错误' });
  }
});

export default router;
