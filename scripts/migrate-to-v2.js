// scripts/migrate-to-v2.js
// 迁移脚本：替换旧版本文件为新版本

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🔄 开始迁移到 Excel 新版本...\n');

const migrations = [
  {
    name: 'excelService.ts',
    from: 'services/excelService-v2.ts',
    to: 'services/excelService.ts',
    description: '更新 Excel 服务为新的 7-Sheet 结构'
  },
  {
    name: 'initExcel.js',
    from: 'scripts/initExcelV2.js',
    to: 'scripts/initExcel.js',
    description: '更新初始化脚本为新版本'
  }
];

try {
  for (const migration of migrations) {
    const fromPath = path.join(projectRoot, migration.from);
    const toPath = path.join(projectRoot, migration.to);

    if (fs.existsSync(fromPath)) {
      const content = fs.readFileSync(fromPath, 'utf-8');
      fs.writeFileSync(toPath, content, 'utf-8');
      console.log(`✅ ${migration.description}`);
      console.log(`   ${migration.to}`);
    } else {
      console.warn(`⚠️  源文件不存在: ${migration.from}`);
    }
  }

  console.log('\n📝 更新 package.json...');
  const packageJsonPath = path.join(projectRoot, 'package.json');
  let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  // 更新初始化脚本
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  packageJson.scripts.init = 'node scripts/initExcel.js';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
  console.log('✅ package.json 已更新');

  console.log('\n🎉 迁移完成！\n');
  console.log('📝 提示:');
  console.log('   1. 回滚旧的 database.xlsx 时自动重新生成');
  console.log('   2. 新的 Excel 文件包含 7 个优化的 Sheet');
  console.log('   3. 所有数据都进行了规范化处理\n');
} catch (error) {
  console.error('❌ 迁移失败:', error);
  process.exit(1);
}
