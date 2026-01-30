/**
 * 若项目根目录没有 .env，则从 .env.example 复制一份，保证项目可正常启动。
 * 已有 .env 时不会覆盖。
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log('[ensure-env] 已从 .env.example 生成 .env，请按需填入 API Key。');
}
