# 部署指南 - Deployment Guide

## 第一步：创建 GitHub 仓库并推送代码

### 创建仓库
1. 访问 https://github.com/new
2. 仓库名：`LK_APP`
3. 选择 **Public**
4. 不要勾选任何初始化选项
5. 点击 **Create repository**

### 推送代码
创建完仓库后，在终端运行：
```powershell
git push -u origin main
```

## 第二步：启用 GitHub Pages

1. 进入仓库页面：https://github.com/Luke7628/LK_APP
2. 点击 **Settings**（设置）
3. 在左侧菜单找到 **Pages**
4. 在 **Build and deployment** 部分：
   - Source: 选择 **GitHub Actions**
5. 保存后，GitHub Actions 会自动开始构建和部署

## 第三步：访问你的网站

- 部署完成后（约 2-3 分钟），访问：
  **https://luke7628.github.io/LK_APP/**

## GitHub Actions 状态

- 查看部署状态：https://github.com/Luke7628/LK_APP/actions
- 绿色 ✓ 表示部署成功
- 红色 ✗ 表示有错误，点击查看详情

## 更新网站

以后每次修改代码并推送到 GitHub 后，网站会自动更新：
```powershell
git add .
git commit -m "更新说明"
git push
```

## 常见问题

### 1. 推送时要求输入密码
使用提供的 Personal Access Token 作为密码。

### 2. 网站显示 404
- 检查 GitHub Pages 是否已启用
- 确认 GitHub Actions 部署是否完成
- 等待 2-3 分钟让 GitHub Pages 生效

### 3. 网站样式错误
- 确认 vite.config.ts 中的 base 路径正确：`base: '/LK_APP/'`
- 检查浏览器控制台是否有资源加载错误

## 本地测试

在推送到 GitHub 之前，可以本地测试构建版本：
```powershell
npm run build
npm run preview
```

## 联系方式

如有问题，请在 GitHub Issues 中提出：
https://github.com/Luke7628/LK_APP/issues
