/**
 * 若项目根目录没有 .env，则从 .env.template 复制一份，保证项目可正常启动。
 * 已有 .env 时不会覆盖，但会检查是否有新增的配置项并提示。
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const templatePath = path.join(root, '.env.template');

if (!fs.existsSync(templatePath)) {
  console.warn('[ensure-env] .env.template 不存在，跳过。');
  process.exit(0);
}

if (!fs.existsSync(envPath)) {
  fs.copyFileSync(templatePath, envPath);
  console.log('[ensure-env] 已从 .env.template 生成 .env，请填入真实配置值。');
} else {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const envContent = fs.readFileSync(envPath, 'utf8');

  const parseKeys = (content) =>
    content
      .split('\n')
      .filter((line) => /^[A-Z_]+=/.test(line.trim()))
      .map((line) => line.trim().split('=')[0]);

  const templateKeys = parseKeys(templateContent);
  const envKeys = parseKeys(envContent);
  const missingKeys = templateKeys.filter((k) => !envKeys.includes(k));

  if (missingKeys.length > 0) {
    console.warn(
      `[ensure-env] .env 缺少以下配置项（参考 .env.template）:\n  ${missingKeys.join('\n  ')}`,
    );
  }
}
