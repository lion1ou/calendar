# 参与贡献

欢迎通过 Issue 和 Pull Request 参与本项目。

## 流程

1. **提 Issue**：功能建议、Bug 反馈请先开 Issue 说明。
2. **Fork**：点击仓库右上角 Fork 到你的账号。
3. **克隆**：`git clone https://github.com/你的用户名/calendar.git`
4. **分支**：`git checkout -b feature/xxx` 或 `fix/xxx`。
5. **开发**：本地修改后执行 `npm run lint`、`npm run format:check` 通过再提交。
6. **提交**：`git commit -m "feat: 简短描述"`，遵循 [Conventional Commits](https://www.conventionalcommits.org/) 更佳。
7. **推送**：`git push origin feature/xxx`，在 GitHub 上对该分支发起 Pull Request。

## 代码规范

- 使用项目内已配置的 ESLint、Prettier，提交前请执行：
  - `npm run lint` 或 `npm run format:fix`
- TypeScript / Vue 3 写法与现有代码风格保持一致即可。

## 配置与密钥

- 请勿在代码或 PR 中提交任何 API Key、Secret。
- 本地开发请复制 `.env.example` 为 `.env` 或 `.env.local` 并自行填写。

感谢你的贡献。
