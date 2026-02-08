# 部署脚本 - Deploy Script
# 在创建 GitHub 仓库后运行此脚本

Write-Host "🚀 开始推送到 GitHub..." -ForegroundColor Cyan

# 推送代码
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 代码推送成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 下一步操作：" -ForegroundColor Yellow
    Write-Host "1. 访问：https://github.com/Luke7628/LK_APP" -ForegroundColor White
    Write-Host "2. 点击 Settings → Pages" -ForegroundColor White
    Write-Host "3. Source 选择：GitHub Actions" -ForegroundColor White
    Write-Host "4. 等待 2-3 分钟后访问：https://luke7628.github.io/LK_APP/" -ForegroundColor White
    Write-Host ""
    Write-Host "⏳ 正在打开 GitHub 仓库页面..." -ForegroundColor Cyan
    Start-Sleep -Seconds 2
    Start-Process "https://github.com/Luke7628/LK_APP"
    
    Write-Host ""
    Write-Host "📊 查看部署状态：https://github.com/Luke7628/LK_APP/actions" -ForegroundColor Cyan
} else {
    Write-Host "❌ 推送失败！" -ForegroundColor Red
    Write-Host ""
    Write-Host "请确认：" -ForegroundColor Yellow
    Write-Host "1. 是否已在 GitHub 上创建 LK_APP 仓库？" -ForegroundColor White
    Write-Host "   创建地址：https://github.com/new" -ForegroundColor White
    Write-Host "2. 仓库名是否为：LK_APP" -ForegroundColor White
    Write-Host "3. 是否为公开仓库（Public）" -ForegroundColor White
    Write-Host ""
    Write-Host "创建仓库后，再次运行此脚本：" -ForegroundColor Cyan
    Write-Host "   .\deploy.ps1" -ForegroundColor White
}
