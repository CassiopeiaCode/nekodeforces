# CF 自动解题与题解发布 - 前端

本项目是 "AI驱动的Codeforces自动解题与题解发布系统" 的前端部分。它使用 [VitePress](https://vitepress.dev/) 构建，用于展示由AI自动生成的Codeforces题目题解。

## 项目结构

- `docs/`: 存放所有 VitePress 的配置和 Markdown 内容。
  - `Solution/`: 存放所有自动生成的题解 Markdown 文件。
- `package.json`: 定义项目依赖和脚本。
- `vercel.json`: Vercel 部署配置文件。

## 环境准备

在开始之前，请确保你的开发环境中安装了 [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)。

## 安装

1.  进入 `frontend` 目录：
    ```bash
    cd frontend
    ```

2.  安装项目依赖：
    ```bash
    npm install
    ```
    或者使用 `pnpm` 或 `yarn`:
    ```bash
    # pnpm
    pnpm install

    # yarn
    yarn install
    ```

## 本地开发

要启动本地开发服务器并实时预览网站内容，请运行以下命令：

```bash
npm run docs:dev
```

服务启动后，你可以在浏览器中访问 `http://localhost:5173` 查看效果。

## 构建

要将题解网站构建为静态文件，以便部署，请运行：

```bash
npm run docs:build
```

构建产物将默认生成在 `docs/.vitepress/dist` 目录下。

## 预览构建产物

如果你想在本地预览构建后的网站，可以运行：

```bash
npm run docs:preview
```

## 部署

本项目已配置为通过 Vercel 进行自动部署。当代码推送到关联的 Git 仓库时，Vercel 会自动拉取代码、执行构建命令 (`npm run docs:build`) 并将生成的静态网站部署到线上。