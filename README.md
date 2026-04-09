# TokenHub

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg" width="64" height="64" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" width="64" height="64" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2d/Google_AI_Gemini_icon.svg" width="64" height="64" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Anthropic_Logo.svg" width="64" height="64" />
</p>

<p align="center">
  <a href="https://aineural.cloud/tokenhub"><img src="https://img.shields.io/badge/Live-Demo-blue" alt="Live Demo" /></a>
  <a href="https://github.com/Koreyo/aineural/stargazers"><img src="https://img.shields.io/github/stars/Koreyo/aineural" alt="Stars" /></a>
  <a href="https://github.com/Koreyo/aineural/blob/master/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green" alt="License" /></a>
</p>

> AI Token 套餐比价工具 - 汇集主流大模型 API 价格，帮助你选择最划算的方案

## 功能特性

- 📊 **价格对比** - 主流 AI 服务商（OpenAI、Anthropic、Google、DeepSeek 等）的 Token 价格一目了然
- 🔗 **推荐码汇总** - 汇集用户分享的推荐码，使用后可获得返现/折扣
- 💬 **社区评价** - 查看其他用户对各服务商的评价和使用体验
- ⚙️ **管理后台** - 管理员可更新服务商信息、价格和推荐码

## 在线演示

🔗 **访问地址**：https://aineural.cloud/tokenhub

管理后台：https://aineural.cloud/tokenhub/#/admin

## 技术栈

- **前端框架**：React 19 + Vite
- **样式**：Tailwind CSS 4
- **后端**：CloudBase（腾讯云开发）- 云函数 + 云数据库
- **部署**：Nginx

## 本地开发

```bash
# 克隆项目
git clone https://github.com/Koreyo/aineural.git
cd aineural/token-hub

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 云函数部署

项目依赖两个 CloudBase 云函数：

1. `getProviders` - 获取服务商列表和价格
2. `updateProviders` - 更新服务商数据（需要管理员权限）

```bash
# 在 cloudfunctions 目录下部署
tcb fn deploy getProviders
tcb fn deploy updateProviders
```

## 项目结构

```
token-hub/
├── src/
│   ├── components/     # React 组件
│   │   ├── Navbar.jsx
│   │   ├── ProviderCard.jsx
│   │   └── CommentSection.jsx
│   ├── pages/          # 页面组件
│   │   ├── Home.jsx
│   │   ├── AdminLogin.jsx
│   │   └── Settings.jsx
│   ├── lib/            # 工具库
│   │   ├── api.js      # API 调用
│   │   ├── cloudbase.js
│   │   └── referral.js
│   └── hooks/          # React Hooks
├── cloudfunctions/     # 云函数
│   ├── getProviders/
│   └── updateProviders/
└── dist/               # 构建产物
```

## 许可证

本项目基于 MIT 许可证开源 - 详见 [LICENSE](LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

---

如果对你有帮助，欢迎 ⭐ star 支持！