# Excel 数据库功能使用指南

## 概述

Timesheet App 现在支持使用 Excel 文件作为数据库。你可以从 Excel 文件导入数据，编辑后再导出，实现离线数据管理。

## 功能特点

- ✅ 从 Excel 文件导入合同、工时记录、设备和联系人数据
- ✅ 导出当前所有数据到 Excel 文件
- ✅ 下载 Excel 模板文件
- ✅ 支持多个 Sheet 的结构化数据
- ✅ 自动缓存到浏览器本地存储

## 如何使用

### 1. 下载 Excel 模板

1. 打开应用并登录
2. 点击右上角的个人头像旁边的菜单按钮（三个点）
3. 选择 **"下载模板"**
4. 会自动下载一个名为 `timesheet_template.xlsx` 的文件

### 2. 编辑 Excel 文件

下载的 Excel 文件包含 4 个 Sheet：

#### Sheet 1: Contracts（合同信息）
| 列名 | 说明 | 示例 |
|------|------|------|
| ID | 合同唯一标识 | 1 |
| Client | 客户名称 | Example Corp |
| Site | 站点名称 | Main Office |
| EndDate | 结束日期 | 31/12/24 |
| ContractNumber | 合同编号 | CN-2024-001 |
| ContractPlan | 合同计划 | Wlan-T1 |
| ServiceContent | 服务内容 | Network maintenance |
| RemainingHours | 剩余时长 | 100 hrs |
| Amount | 金额 | $10,000 |
| Status | 状态 | Active 或 Expired 或 Pending |
| Category | 类别 | Wlan-T1 |
| Location | 位置 | Building A, Floor 2 |

#### Sheet 2: HourLogs（工时记录）
| 列名 | 说明 | 示例 |
|------|------|------|
| ContractID | 关联的合同 ID | 1 |
| LogID | 日志唯一标识 | log-1 |
| Engineer | 工程师名字 | John |
| Description | 工作描述 | Network setup |
| Duration | 工作时长 | 4.5 hrs |
| Date | 日期 | 01/02/26 |
| CreatedAt | 创建时间 | 2026-02-01T10:00:00.000Z |
| UpdatedAt | 更新时间 | 2026-02-01T10:00:00.000Z |

#### Sheet 3: Equipment（设备列表）
| 列名 | 说明 | 示例 |
|------|------|------|
| ContractID | 关联的合同 ID | 1 |
| SerialNumber | 序列号 | SN001 |
| Model | 型号 | Router-X200 |
| Status | 状态 | Active 或 Inactive |

#### Sheet 4: Contacts（联系人）
| 列名 | 说明 | 示例 |
|------|------|------|
| ContractID | 关联的合同 ID | 1 |
| Name | 联系人姓名 | John Doe |
| Role | 职位 | IT Manager |
| Email | 邮箱 | john.doe@example.com |
| Phone | 电话 | 555-0100 |

### 3. 导入 Excel 数据

1. 在应用中点击菜单按钮（三个点）
2. 选择 **"导入 Excel"**
3. 选择你编辑好的 Excel 文件（.xlsx 或 .xls）
4. 导入成功后，页面会自动刷新并加载新数据

### 4. 导出当前数据

1. 在应用中点击菜单按钮（三个点）
2. 选择 **"导出 Excel"**
3. 会自动下载一个名为 `timesheet_database.xlsx` 的文件
4. 文件包含当前应用中的所有数据

## Excel 文件结构

```
timesheet_database.xlsx
├── Contracts (合同基本信息)
├── HourLogs (工时记录明细)
├── Equipment (设备清单)
└── Contacts (联系人信息)
```

## 数据关联说明

- **HourLogs**、**Equipment** 和 **Contacts** 通过 `ContractID` 关联到 **Contracts**
- 确保每条子记录的 `ContractID` 都存在于 Contracts Sheet 中
- 一个合同可以有多条工时记录、多个设备和多个联系人

## 注意事项

⚠️ **重要提示：**
1. 导入 Excel 文件会替换当前应用中的所有数据
2. 建议在导入新数据前先导出当前数据作为备份
3. Excel 文件必须包含正确的列名（区分大小写）
4. 日期格式必须为 DD/MM/YY（例如：01/02/26）
5. 时间戳格式必须为 ISO 8601（例如：2026-02-01T10:00:00.000Z）
6. Status 字段只能是：Active、Expired 或 Pending
7. Equipment.Status 只能是：Active 或 Inactive

## 数据流程

```
1. 下载模板 → 2. 编辑 Excel → 3. 导入应用 → 4. 使用应用 → 5. 导出 Excel → 6. 循环
```

## 技术实现

- 使用 `xlsx` 库处理 Excel 文件
- 数据缓存到浏览器 localStorage
- 支持 .xlsx 和 .xls 格式
- 自动处理数据转换和验证

## 常见问题

### Q: 导入后数据没有显示？
A: 检查 Excel 文件的 Sheet 名称是否正确：Contracts, HourLogs, Equipment, Contacts

### Q: 导入失败显示错误？
A: 确保 Excel 文件中的列名与模板完全一致（包括大小写）

### Q: 可以使用 Google Sheets 吗？
A: 可以，但需要先下载为 .xlsx 格式

### Q: 数据会丢失吗？
A: 数据会保存在浏览器的 localStorage 中，清除浏览器数据会导致丢失，建议定期导出备份

## 下一步计划

- [ ] 支持云端 Excel 同步（OneDrive/Google Drive）
- [ ] 数据验证和错误提示
- [ ] 批量编辑功能
- [ ] 数据版本控制
