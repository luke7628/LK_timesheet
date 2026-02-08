# Excel 数据库优化版使用指南 (V2)

## 概述

经过完全重构，Timesheet App 现在使用一个**规范化的 7-Sheet Excel 数据库结构**，使得数据管理、维护和扩展变得更加直观和高效。

## 📊 Excel 文件结构

数据库文件 `database.xlsx` 包含以下 7 个 Sheet，采用关系型数据库的思想设计：

### Sheet 1: **Contracts** (合同基本信息)

存储合同的核心信息和汇总数据。

| 列名 | 说明 | 示例 |
|------|------|------|
| **ContractID** | 合同唯一 ID | 1 |
| **Client** | 客户名称 | Acme Corp |
| **Site** | 站点名称 | Downtown Site |
| **Address** | 详细地址 | 123 Main Street, Downtown, Suite 500 |
| **Status** | 合同状态 | Active / Expired / Pending |
| **ExpiresDate** | 失效日期 (DD/MM/YY) | 24/10/24 |
| **SystelineContractNumber** | 企业系统合同号 | SYS-2024-001 |
| **ContractType** | 合同类型 | Network Infrastructure |
| **CreatedDate** | 创建日期 (DD/MM/YY) | 01/01/23 |
| **Notes** | 备注 | Large enterprise contract with SLA |

**用途**：快速查看合同列表，过滤和搜索

---

### Sheet 2: **ContractDetails** (合同详细信息)

存储每个合同的财务和资源信息。一对一关联到 Contracts。

| 列名 | 说明 | 示例 |
|------|------|------|
| **ContractID** | 合同 ID (关联 Contracts) | 1 |
| **ServiceContent** | 服务详细描述 | HVAC Maintenance and Repair... |
| **ContractAmount** | 合同总金额 | $12,500 |
| **RemainingHours** | 剩余工时 | 120 hrs |
| **BudgetedHours** | 预算总工时 | 200 hrs |
| **HourlyRate** | 小时费率 | $62.50 |
| **Category** | 合同分类 | Wlan-T1, Wlan-T2 |
| **LastModified** | 最后修改日期 | 08/02/26 |

**用途**：详细的财务和预算跟踪

---

### Sheet 3: **ContractDocuments** (合同文档/PDF)

存储所有与合同相关的文档和 PDF 链接。一个合同可有多个文档。

| 列名 | 说明 | 示例 |
|------|------|------|
| **DocumentID** | 文档唯一 ID | DOC-001 |
| **ContractID** | 关联的合同 ID | 1 |
| **DocumentName** | 文档名称 | Service Agreement - Acme Corp |
| **DocumentType** | 文档类型 | Agreement / Specification / Manual |
| **FileLink** | PDF 文件链接 | /documents/acme-service-agreement.pdf |
| **UploadDate** | 上传日期 (DD/MM/YY) | 01/01/23 |
| **Description** | 文档描述 | Main service level agreement document |

**用途**：集中管理所有合同相关的文档和链接

---

### Sheet 4: **Contacts** (联系人信息)

存储每个合同的站点联系人信息。一个合同可有多个联系人。

| 列名 | 说明 | 示例 |
|------|------|------|
| **ContactID** | 联系人唯一 ID | CON-001 |
| **ContractID** | 关联的合同 ID | 1 |
| **Name** | 联系人姓名 | Sarah Jenkins |
| **Position** | 职位 | Facility Manager |
| **Department** | 部门 | Operations |
| **Email** | 电子邮箱 | s.jenkins@acme.com |
| **Phone** | 办公电话 | 555-0101 |
| **Mobile** | 手机号码 | 555-9001 |

**用途**：快速查找和联系客户代表

---

### Sheet 5: **Equipment** (设备清单)

存储所有合同下的设备信息。一个合同可有多台设备。

| 列名 | 说明 | 示例 |
|------|------|------|
| **EquipmentID** | 设备唯一 ID | EQ-001 |
| **ContractID** | 关联的合同 ID | 1 |
| **SerialNumber** | 序列号 | 998877 |
| **Model** | 设备型号 | AHU-200X |
| **Manufacturer** | 制造商 | ThermaCorp |
| **Status** | 状态 | Active / Inactive |
| **InstallationDate** | 安装日期 (DD/MM/YY) | 15/01/23 |
| **LastServiceDate** | 最后服务日期 | 08/01/26 |
| **NextServiceDate** | 下次服务日期 | 08/03/26 |

**用途**：设备管理、维保跟踪、库存统计

---

### Sheet 6: **HourLogs** (工时记录汇总)

存储每条工时记录的汇总信息。包含日期、工程师、任务和总时长。

| 列名 | 说明 | 示例 |
|------|------|------|
| **LogID** | 工时记录 ID | LOG-00001 |
| **ContractID** | 关联的合同 ID | 1 |
| **Engineer** | 工程师名字 | Alex |
| **Task** | 任务描述 | Routine maintenance and sensor calibration |
| **Date** | 工作日期 (DD/MM/YY) | 08/02/26 |
| **Duration** | 总工时 | 4.5 hrs |
| **Status** | 状态 | Completed / In Progress |
| **CreatedAt** | 记录时间戳 | ISO 8601 格式 |

**用途**：工时统计、工程师工作量跟踪

---

### Sheet 7: **HourLogsDetails** (工时细目)

存储每条工时记录的详细分解。一条工时记录可有多条细目。

| 列名 | 说明 | 示例 |
|------|------|------|
| **DetailID** | 细目唯一 ID | DET-000001 |
| **LogID** | 关联的工时记录 ID | LOG-00001 |
| **Activity** | 具体活动 | Installation / Testing / Configuration |
| **TaskCategory** | 任务类别 | Technical / Administrative / Training |
| **StartTime** | 开始时间 (HH:mm) | 08:00 |
| **EndTime** | 结束时间 (HH:mm) | 12:00 |
| **Hours** | 实际工时 | 4.0 |
| **Notes** | 备注 | Work completed successfully |

**用途**：详细的工时统计、成本分析、绩效评估

---

## 🔗 数据关系图

```
Contracts (1)
   ├── (1:1) ContractDetails
   ├── (1:N) ContractDocuments
   ├── (1:N) Contacts
   ├── (1:N) Equipment
   └── (1:N) HourLogs
              └── (1:N) HourLogsDetails
```

所有关系通过 **ID** 字段关联：
- `ContractID` 是主键，用于关联所有其他表
- `DocumentID`, `ContactID`, `EquipmentID`, `LogID` 是各自的主键
- `DetailID` 用于唯一标识工时细目

---

## 📝 数据输入指南

### 添加新合同

1. **在 Contracts Sheet 添加一行**
   - 填写 ContractID（如 4）
   - 填写客户名称、站点、地址等基本信息

2. **在 ContractDetails Sheet 添加对应行**
   - 使用相同的 ContractID
   - 填写服务内容、金额等详细信息

3. **关联文档、联系人、设备**
   - 在相应 Sheet 中添加行，使用相同的 ContractID

### 添加工时记录

1. **在 HourLogs 中添加记录**
   - 填写 LogID（如 LOG-00061）
   - 填写 ContractID、日期、工程师、任务、总时长

2. **在 HourLogsDetails 中添加细目**（可选但推荐）
   - 使用相同的 LogID
   - 分解为多条细目，记录具体活动和时间段

---

## ✅ 数据验证规则

| 字段 | 验证规则 |
|------|---------|
| **ContractID** | 必填，唯一值 |
| **Date** | DD/MM/YY 格式（如 08/02/26） |
| **Status** | 只能是 Active / Expired / Pending |
| **Equipment.Status** | 只能是 Active / Inactive |
| **Duration** | 数字 + "hrs"（如 4.5 hrs） |
| **Time Fields** | HH:mm 格式（如 08:00） |
| **ContractAmount** | 含货币符号（如 $12,500） |

---

## 🔄 导入/导出流程

### 导出当前数据

```
应用菜单 → 导出 Excel
↓
下载 timesheet_database.xlsx（包含 7 个 Sheet）
↓
可在 Excel 中编辑和分析
```

### 导入新数据

```
编辑 Excel 文件（保留所有 7 个 Sheet）
↓
应用菜单 → 导入 Excel
↓
选择修改后的文件
↓
数据自动加载到应用
```

---

## 📊 常见查询示例

### 查询特定合同的所有信息

1. 在 Contracts 中找到目标合同行
2. 记录其 ContractID
3. 在其他表中使用 **筛选** 显示相同 ContractID 的所有数据

### 统计工程师的工时

1. 打开 HourLogs
2. 按 Engineer 列筛选
3. 求 Duration 列的和

### 查看设备维保计划

1. 打开 Equipment
2. 查看 LastServiceDate 和 NextServiceDate
3. 筛选需要即将进行维保的设备

---

## 🎯 最佳实践

1. ✅ **保持数据一致性** - ContractID 必须在所有相关表中存在
2. ✅ **定期备份** - 每周导出一次 Excel 作为备份
3. ✅ **使用描述性名称** - DocumentName、Task 等尽量详细
4. ✅ **及时更新状态** - 合同过期或员工离职时及时更新
5. ✅ **规范化时间格式** - 始终使用指定的日期和时间格式

---

## 🚀 高级功能

### 工时细目分析

HourLogsDetails 提供的详细数据可用于：
- 按活动类型统计工时
- 分析任务效率
- 生成详细账单

### 文档管理

ContractDocuments 支持：
- 存储多个相关文档链接
- 按文档类型分类
- 追踪上传日期

### 设备维保

Equipment 可跟踪：
- 设备生命周期
- 维保计划
- 制造商信息

---

## 🆘 故障排除

### 导入失败：列名不匹配
- 检查 Sheet 名称是否正确（区分大小写）
- 确保列名精确匹配（如 ContractID 不是 Contract_ID）

### 导入失败：数据类型错误
- Date 必须是 DD/MM/YY 格式
- 数字字段不要包含文本
- Duration 必须包含 "hrs"

### 某些数据没有加载
- 确保每条记录都有有效的关联 ID
- 检查 ContractID 是否在 Contracts Sheet 中存在

---

## 📞 支持

有问题？查看：
- `EXCEL_GUIDE.md` - 基础使用指南
- 应用内的菜单选项
- 下载模板进行参考

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.0 | 2026-02-08 | 优化为 7-Sheet 规范化结构 |
| v1.0 | 2026-02-01 | 初始 4-Sheet 设计 |

