#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# ---- 从 .env 读取部署配置 ----
if [ ! -f .env ]; then
  echo "错误: .env 文件不存在，请先运行 npm run ensure-env 并填入配置"
  exit 1
fi

load_env_var() {
  local val
  val=$(grep "^$1=" .env | head -n1 | cut -d'=' -f2-)
  echo "$val"
}

DEPLOY_HOST=$(load_env_var "DEPLOY_HOST")
DEPLOY_DIR=$(load_env_var "DEPLOY_DIR")
DEPLOY_UPLOAD_DIR=$(load_env_var "DEPLOY_UPLOAD_DIR")
APP_NAME=$(load_env_var "DEPLOY_APP_NAME")

# 校验必要配置
if [ -z "$DEPLOY_HOST" ]; then
  echo "错误: DEPLOY_HOST 未配置，请在 .env 中填入远程服务器地址"
  exit 1
fi

APP_NAME=${APP_NAME:-"calendar"}
DEPLOY_DIR=${DEPLOY_DIR:-"/workspace/toy/calendar"}
DEPLOY_UPLOAD_DIR=${DEPLOY_UPLOAD_DIR:-"/workspace/toy"}
TIMESTAMP=$(date +%Y%m%d%H%M%S)

echo "[$APP_NAME] 部署开始... $TIMESTAMP"
echo "  目标: $DEPLOY_HOST:$DEPLOY_DIR"

# 1. 安装依赖 & 构建（前端 + 服务端）
echo "[1/5] 安装依赖..."
npm install || { echo "npm install 失败"; exit 1; }

echo "[2/5] 构建项目..."
npm run build || { echo "构建失败"; exit 1; }

# 2. 打包部署产物（dist + server-dist + 必要文件）
echo "[3/5] 打包部署产物..."
PACKAGE_DIR="deploy-$TIMESTAMP"
mkdir -p "$PACKAGE_DIR"
cp -r dist "$PACKAGE_DIR/"
cp -r server-dist "$PACKAGE_DIR/"
cp package.json "$PACKAGE_DIR/"
cp package-lock.json "$PACKAGE_DIR/" 2>/dev/null
cp scripts/ecosystem.config.js "$PACKAGE_DIR/"

tar -czf "$PACKAGE_DIR.tar.gz" "$PACKAGE_DIR"
rm -rf "$PACKAGE_DIR"

# 3. 上传到服务器
echo "[4/5] 上传到服务器..."
scp "$PACKAGE_DIR.tar.gz" "$DEPLOY_HOST:$DEPLOY_UPLOAD_DIR/" || { echo "上传失败"; exit 1; }
rm -f "$PACKAGE_DIR.tar.gz"

# 4. 远程解压、安装生产依赖、PM2 重启
echo "[5/5] 远程部署..."
ssh "$DEPLOY_HOST" << ENDSSH
  cd "$DEPLOY_UPLOAD_DIR"
  tar -xzf "$PACKAGE_DIR.tar.gz"

  # 备份旧版本
  [ -d "$APP_NAME" ] && rm -rf "${APP_NAME}-prev" && mv "$APP_NAME" "${APP_NAME}-prev"
  mv "$PACKAGE_DIR" "$APP_NAME"

  # 安装生产依赖
  cd "$APP_NAME"
  npm install --omit=dev

  # 确保 .env 存在（首次需手动配置）
  if [ ! -f .env ]; then
    echo "警告: .env 文件不存在，请手动配置后重启服务"
    [ -f "../${APP_NAME}-prev/.env" ] && cp "../${APP_NAME}-prev/.env" .env && echo "已从旧版本复制 .env"
  fi

  # PM2 重启
  pm2 startOrRestart ecosystem.config.js
  pm2 save

  # 清理旧压缩包（保留最近 3 个）
  cd "$DEPLOY_UPLOAD_DIR"
  ls -t deploy-*.tar.gz 2>/dev/null | tail -n +4 | xargs rm -f --

  echo "部署完成！"
ENDSSH

echo "[$APP_NAME] 部署完成"
