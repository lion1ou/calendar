#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# ---- 从 .env 读取配置 ----
if [ ! -f .env ]; then
  echo "❌ .env 文件不存在，请先复制 .env.template 并填入配置"
  exit 1
fi

load_env_var() {
  grep "^$1=" .env 2>/dev/null | head -n1 | cut -d'=' -f2-
}

DEPLOY_HOST=$(load_env_var "DEPLOY_HOST")
DEPLOY_DIR=$(load_env_var "DEPLOY_DIR")
DEPLOY_UPLOAD_DIR=$(load_env_var "DEPLOY_UPLOAD_DIR")
APP_NAME=$(load_env_var "DEPLOY_APP_NAME")

# 校验部署配置
MISSING=""
[ -z "$DEPLOY_HOST" ] && MISSING="$MISSING DEPLOY_HOST"
[ -z "$DEPLOY_DIR" ] && MISSING="$MISSING DEPLOY_DIR"
[ -z "$DEPLOY_UPLOAD_DIR" ] && MISSING="$MISSING DEPLOY_UPLOAD_DIR"
[ -z "$APP_NAME" ] && MISSING="$MISSING DEPLOY_APP_NAME"

if [ -n "$MISSING" ]; then
  echo "❌ .env 中以下配置项未填写:$MISSING"
  exit 1
fi

# 校验天气 API 密钥（至少配置一个）
GD_KEY=$(load_env_var "GD_WEATHER_KEY")
HF_KEY=$(load_env_var "HF_WEATHER_KEY")
XZ_KEY=$(load_env_var "XZ_WEATHER_KEY")

if [ -z "$GD_KEY" ] && [ -z "$HF_KEY" ] && [ -z "$XZ_KEY" ]; then
  echo "❌ 未配置任何天气 API 密钥，请至少配置一个"
  exit 1
fi

TIMESTAMP=$(date +%Y%m%d%H%M%S)
PACKAGE_NAME="deploy-$TIMESTAMP"

echo "=========================================="
echo " 部署 $APP_NAME → $DEPLOY_HOST:$DEPLOY_DIR"
echo " $TIMESTAMP"
echo "=========================================="

# ---- 1. 安装依赖 ----
echo ""
echo "[1/5] 安装依赖..."
npm install --prefer-offline || { echo "❌ npm install 失败"; exit 1; }

# ---- 2. 构建 ----
echo ""
echo "[2/5] 构建项目（前端 + 服务端）..."
npm run build || { echo "❌ 构建失败"; exit 1; }

# ---- 3. 打包部署产物 ----
echo ""
echo "[3/5] 打包部署产物..."
mkdir -p "$PACKAGE_NAME"

cp -r dist/* "$PACKAGE_NAME/"
cp -r server-dist "$PACKAGE_NAME/"
cp package.json "$PACKAGE_NAME/"
cp package-lock.json "$PACKAGE_NAME/" 2>/dev/null || true
cp scripts/ecosystem.config.js "$PACKAGE_NAME/"

# 生成生产环境 .env（仅保留天气 API 密钥）
{
  echo "# Auto-generated for production - $TIMESTAMP"
  grep "^GD_WEATHER_KEY=" .env || true
  grep "^HF_WEATHER_KEY=" .env || true
  grep "^XZ_WEATHER_KEY=" .env || true
  grep "^XZ_WEATHER_SECRET=" .env || true
} > "$PACKAGE_NAME/.env"

echo ""
echo "  📦 部署产物目录结构:"
echo "  ─────────────────────"
if command -v tree &>/dev/null; then
  tree -L 2 --dirsfirst "$PACKAGE_NAME" | sed 's/^/  /'
else
  find "$PACKAGE_NAME" -maxdepth 2 | sort | while read -r f; do
    depth=$(echo "$f" | tr -cd '/' | wc -c)
    indent=$(printf '%*s' "$((depth * 2))" '')
    echo "  $indent$(basename "$f")"
  done
fi
echo ""

tar -czf "$PACKAGE_NAME.tar.gz" "$PACKAGE_NAME"
PACKAGE_SIZE=$(du -sh "$PACKAGE_NAME.tar.gz" | cut -f1)
rm -rf "$PACKAGE_NAME"
echo "  产物包: $PACKAGE_NAME.tar.gz ($PACKAGE_SIZE)"

# ---- 4. 上传 ----
echo ""
echo "[4/5] 上传到 $DEPLOY_HOST..."
scp "$PACKAGE_NAME.tar.gz" "$DEPLOY_HOST:$DEPLOY_UPLOAD_DIR/" || { echo "❌ 上传失败"; rm -f "$PACKAGE_NAME.tar.gz"; exit 1; }
rm -f "$PACKAGE_NAME.tar.gz"

# ---- 5. 远程部署 ----
echo ""
echo "[5/5] 远程部署..."
ssh "$DEPLOY_HOST" bash -s -- "$DEPLOY_UPLOAD_DIR" "$PACKAGE_NAME" "$APP_NAME" "$DEPLOY_DIR" <<'ENDSSH'
  set -euo pipefail

  # 非交互式 SSH 需要手动加载 nvm / node 环境
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

  if ! command -v npm &>/dev/null; then
    echo "❌ 远程服务器未找到 npm，请确认 Node.js 已安装"
    exit 1
  fi

  UPLOAD_DIR="$1"
  PKG_NAME="$2"
  APP="$3"
  TARGET_DIR="$4"

  cd "$UPLOAD_DIR"

  echo "  解压 $PKG_NAME.tar.gz ..."
  tar -xzf "$PKG_NAME.tar.gz"

  # 备份旧版本（仅保留上一个版本）
  if [ -d "$TARGET_DIR" ]; then
    echo "  备份旧版本..."
    rm -rf "${TARGET_DIR}-prev"
    mv "$TARGET_DIR" "${TARGET_DIR}-prev"
  fi

  echo "  部署新版本..."
  mv "$PKG_NAME" "$TARGET_DIR"

  cd "$TARGET_DIR"

  echo "  安装生产依赖..."
  npm install --omit=dev --prefer-offline 2>&1 | tail -1

  echo "  重启 PM2 服务..."
  pm2 startOrRestart ecosystem.config.js
  pm2 save --force

  # 清理旧压缩包（保留最近 3 个）
  cd "$UPLOAD_DIR"
  ls -t deploy-*.tar.gz 2>/dev/null | tail -n +4 | xargs rm -f -- 2>/dev/null || true

  echo ""
  echo "  ✅ 部署完成！"
  echo "  服务状态:"
  pm2 show "$APP" --no-color 2>/dev/null | grep -E "status|uptime|restarts" || true
ENDSSH

echo ""
echo "=========================================="
echo " ✅ $APP_NAME 部署完成"
echo "=========================================="
