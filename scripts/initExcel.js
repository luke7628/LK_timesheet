// scripts/initExcelV2.js
// 改进版初始化脚本：生成带有完整、优化结构的 Excel 数据库
// 用法: node scripts/initExcelV2.js

import XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 优化的 Excel 结构设计：
 * 
 * Sheet 1: Contracts (合同基本信息)
 * Sheet 2: ContractDetails (合同详细信息)
 * Sheet 3: ContractDocuments (合同文档/PDF)
 * Sheet 4: Contacts (联系人信息)
 * Sheet 5: Equipment (设备清单)
 * Sheet 6: HourLogs (工时记录汇总)
 * Sheet 7: HourLogsDetails (工时记录细目)
 */

// 基础合同数据（与应用内 12 个客户保持一致）
const baseContracts = [
  {
    id: '1',
    client: 'Acme Corp',
    site: 'Downtown Site',
    endDate: '24/10/24',
    contractNumber: 'CN-2023-849',
    contractPlan: 'Wlan-T1',
    serviceContent: 'HVAC Maintenance and Repair for the main data center and satellite offices.',
    remainingHours: '120 hrs',
    amount: '$12,500',
    status: 'Active',
    category: 'Wlan-T1',
    location: 'Building A, 4th Floor',
    contacts: [
      { name: 'Sarah Jenkins', role: 'Facility Manager', email: 's.jenkins@acme.com', phone: '555-0101' },
      { name: 'Marcus Chen', role: 'Site Engineer', email: 'm.chen@acme.com', phone: '555-0102' }
    ],
    logCount: 25
  },
  {
    id: '2',
    client: 'BioGreen',
    site: 'North Campus',
    endDate: '01/11/24',
    contractNumber: 'BG-8842',
    contractPlan: 'Wlan-T2',
    serviceContent: 'Greenhouse Automation and smart irrigation control systems support.',
    remainingHours: '45 hrs',
    amount: '$5,200',
    status: 'Active',
    category: 'Wlan-T2',
    location: 'Campus West, Level 2',
    contacts: [
      { name: 'Elena Frost', role: 'Lead Researcher', email: 'e.frost@biogreen.com', phone: '555-0201' }
    ],
    logCount: 18
  },
  {
    id: '3',
    client: 'Bolt Systems',
    site: 'Main Office',
    endDate: '12/11/24',
    contractNumber: 'BT-001',
    contractPlan: 'Wlan-T1',
    serviceContent: 'High-Speed Connectivity and low-latency network infrastructure.',
    remainingHours: '12 hrs',
    amount: '$840',
    status: 'Active',
    category: 'Wlan-T1',
    location: 'Tower B, Suite 500',
    contacts: [
      { name: 'James Bolt', role: 'CEO', email: 'j.bolt@boltsystems.com', phone: '555-0301' }
    ],
    logCount: 30
  },
  {
    id: '4',
    client: 'ClearWater',
    site: 'East Hub',
    endDate: '05/12/24',
    contractNumber: 'CW-1002',
    contractPlan: 'Wlan-T3',
    serviceContent: 'Water Treatment Plant Monitoring and automated alert systems.',
    remainingHours: '210 hrs',
    amount: '$18,900',
    status: 'Active',
    category: 'Wlan-T3',
    location: 'Processing Unit C',
    contacts: [
      { name: 'Linda Waters', role: 'Operations Chief', email: 'linda@clearwater.com', phone: '555-0401' }
    ],
    logCount: 22
  },
  {
    id: '5',
    client: 'Designify',
    site: 'Studio A',
    endDate: '10/01/25',
    contractNumber: 'DS-9901',
    contractPlan: 'Wlan-T2',
    serviceContent: 'Network Security Audit and penetration testing for design labs.',
    remainingHours: '38 hrs',
    amount: '$3,450',
    status: 'Active',
    category: 'Wlan-T2',
    location: 'Creative Quarter',
    contacts: [
      { name: 'Sophie Design', role: 'Creative Director', email: 'sophie@designify.com', phone: '555-0501' }
    ],
    logCount: 15
  },
  {
    id: '6',
    client: 'Echo Retail',
    site: 'Flagship Store',
    endDate: '15/09/24',
    contractNumber: 'ER-5521',
    contractPlan: 'Wlan-T1',
    serviceContent: 'In-store WiFi Optimization and guest portal management.',
    remainingHours: '88 hrs',
    amount: '$9,800',
    status: 'Active',
    category: 'Wlan-T1',
    location: 'Main Mall, Ground Floor',
    contacts: [
      { name: 'Tom Retailer', role: 'Store Lead', email: 'tom@echo.com', phone: '555-0601' }
    ],
    logCount: 20
  },
  {
    id: '7',
    client: 'Future Logistics',
    site: 'Warehouse 4',
    endDate: '20/08/24',
    contractNumber: 'FL-2024-X',
    contractPlan: 'Wlan-T3',
    serviceContent: 'Autonomous Robot Network maintenance and low-latency radio control.',
    remainingHours: '350 hrs',
    amount: '$45,000',
    status: 'Active',
    category: 'Wlan-T3',
    location: 'Industrial Zone B',
    contacts: [
      { name: 'Gary Trucker', role: 'Logistics Manager', email: 'gary@future.com', phone: '555-0701' }
    ],
    logCount: 45
  },
  {
    id: '8',
    client: 'Global Health',
    site: 'St. Mary Hospital',
    endDate: '05/10/24',
    contractNumber: 'GH-900',
    contractPlan: 'Wlan-T2',
    serviceContent: 'Critical Care Monitoring Network with 99.99% uptime requirement.',
    remainingHours: '15 hrs',
    amount: '$12,000',
    status: 'Active',
    category: 'Wlan-T2',
    location: 'ICU Ward, Wing A',
    contacts: [
      { name: 'Dr. Emily Smith', role: 'IT Health Chief', email: 'emily@gh.org', phone: '555-0801' }
    ],
    logCount: 12
  },
  {
    id: '9',
    client: 'Horizon Power',
    site: 'Substation Alpha',
    endDate: '30/11/24',
    contractNumber: 'HP-112',
    contractPlan: 'Wlan-T3',
    serviceContent: 'Remote SCADA Support and electrical grid telemetry monitoring.',
    remainingHours: '145 hrs',
    amount: '$22,500',
    status: 'Active',
    category: 'Wlan-T3',
    location: 'High Desert Facility',
    contacts: [
      { name: 'Ray Volt', role: 'Field Lead', email: 'ray@horizon.com', phone: '555-0901' }
    ],
    logCount: 28
  },
  {
    id: '10',
    client: 'Innova Tech',
    site: 'Innovation Lab',
    endDate: '25/12/24',
    contractNumber: 'IT-440',
    contractPlan: 'Wlan-T1',
    serviceContent: 'R&D Network Maintenance and high-performance computing interconnects.',
    remainingHours: '20 hrs',
    amount: '$4,000',
    status: 'Active',
    category: 'Wlan-T1',
    location: 'Tech Park, Building 2',
    contacts: [
      { name: 'Jane Innova', role: 'Lab Director', email: 'jane@innova.io', phone: '555-1001' }
    ],
    logCount: 14
  },
  {
    id: '11',
    client: 'JetStream Air',
    site: 'Terminal 5',
    endDate: '15/01/25',
    contractNumber: 'JA-778',
    contractPlan: 'Wlan-T2',
    serviceContent: 'Passenger WiFi Management and terminal-wide digital signage.',
    remainingHours: '500 hrs',
    amount: '$65,000',
    status: 'Active',
    category: 'Wlan-T2',
    location: 'Airport South',
    contacts: [
      { name: 'Leo Wing', role: 'Aviation IT', email: 'leo@jetstream.com', phone: '555-1101' }
    ],
    logCount: 50
  },
  {
    id: '12',
    client: 'Krypton Security',
    site: 'Vault Site',
    endDate: '10/02/25',
    contractNumber: 'KS-007',
    contractPlan: 'Wlan-T3',
    serviceContent: 'Encrypted Communication Tunnel and high-security facility access control.',
    remainingHours: '120 hrs',
    amount: '$30,000',
    status: 'Active',
    category: 'Wlan-T3',
    location: 'Underground B4',
    contacts: [
      { name: 'Agent K', role: 'Security Chief', email: 'k@krypton.com', phone: '555-0007' }
    ],
    logCount: 35
  }
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// 合同基础信息
const mockContracts = baseContracts.map((contract, index) => ({
  ContractID: contract.id,
  Client: contract.client,
  Site: contract.site,
  Address: contract.location,
  Status: contract.status,
  ExpiresDate: contract.endDate,
  SystelineContractNumber: `SYS-2024-${String(index + 1).padStart(3, '0')}`,
  ContractType: contract.contractPlan,
  ContractNumber: contract.contractNumber,
  CreatedDate: '01/01/23',
  Notes: ''
}));

// 合同详细信息
const contractDetails = baseContracts.map((contract) => ({
  ContractID: contract.id,
  ServiceContent: contract.serviceContent,
  ContractAmount: contract.amount,
  RemainingHours: contract.remainingHours,
  BudgetedHours: contract.remainingHours,
  HourlyRate: '',
  Category: contract.category,
  LastModified: '08/02/26'
}));

// 合同文档/PDF
const contractDocuments = baseContracts.map((contract, index) => ({
  DocumentID: `DOC-${String(index + 1).padStart(3, '0')}`,
  ContractID: contract.id,
  DocumentName: `${contract.client} - Contract Summary`,
  DocumentType: 'Agreement',
  FileLink: `/documents/${slugify(contract.client)}-contract.pdf`,
  UploadDate: '01/01/23',
  Description: 'Primary contract document'
}));

// 联系人信息
const contacts = baseContracts.flatMap((contract) =>
  contract.contacts.map((contact, index) => ({
    ContactID: `CON-${String(contract.id).padStart(3, '0')}-${String(index + 1).padStart(2, '0')}`,
    ContractID: contract.id,
    Name: contact.name,
    Position: contact.role,
    Department: 'Operations',
    Email: contact.email,
    Phone: contact.phone,
    Mobile: contact.phone
  }))
);

// 生成设备信息
function generateEquipment() {
  const equipment = [
    {
      EquipmentID: 'EQ-001',
      ContractID: '1',
      SerialNumber: '998877',
      Model: 'AHU-200X',
      Manufacturer: 'ThermaCorp',
      Status: 'Active',
      InstallationDate: '15/01/23',
      LastServiceDate: '08/01/26',
      NextServiceDate: '08/03/26'
    },
    {
      EquipmentID: 'EQ-002',
      ContractID: '1',
      SerialNumber: '112233',
      Model: 'CT-500',
      Manufacturer: 'CoolTech',
      Status: 'Inactive',
      InstallationDate: '20/02/23',
      LastServiceDate: '10/12/25',
      NextServiceDate: '10/03/26'
    },
    {
      EquipmentID: 'EQ-003',
      ContractID: '2',
      SerialNumber: 'GH-001',
      Model: 'SensorHub-Pro',
      Manufacturer: 'GreenTech',
      Status: 'Active',
      InstallationDate: '01/04/23',
      LastServiceDate: '05/02/26',
      NextServiceDate: '05/04/26'
    },
    {
      EquipmentID: 'EQ-004',
      ContractID: '2',
      SerialNumber: 'GH-002',
      Model: 'IrrigationControl-3000',
      Manufacturer: 'AquaFlow',
      Status: 'Active',
      InstallationDate: '10/04/23',
      LastServiceDate: '08/02/26',
      NextServiceDate: '08/04/26'
    },
    {
      EquipmentID: 'EQ-005',
      ContractID: '3',
      SerialNumber: 'BS-101',
      Model: 'Router-X1000',
      Manufacturer: 'NetCore',
      Status: 'Active',
      InstallationDate: '01/06/23',
      LastServiceDate: '01/02/26',
      NextServiceDate: '01/04/26'
    },
    {
      EquipmentID: 'EQ-006',
      ContractID: '3',
      SerialNumber: 'BS-102',
      Model: 'Switch-Core-48',
      Manufacturer: 'NetCore',
      Status: 'Active',
      InstallationDate: '05/06/23',
      LastServiceDate: '03/02/26',
      NextServiceDate: '03/04/26'
    }
  ];
  return equipment;
}

// 生成工时记录
function generateHourLogs() {
  const engineers = ['Alex', 'Jordan', 'Sarah', 'Marcus', 'Sam', 'Elena', 'James', 'Linda'];
  const tasks = [
    'Routine maintenance and sensor calibration',
    'WiFi troubleshoot and AP repositioning',
    'Firmware update for core switches',
    'Assist site enrolled 2 new devices',
    'Emergency repair on HVAC controller',
    'Monthly connectivity audit',
    'Software patch deployment',
    'Signal strength mapping and report',
    'Hardware inspection of main rack',
    'Network optimization for guest portal'
  ];

  const logs = [];
  const baseDate = new Date();
  let logId = 1;

  // 为每个合同生成工时记录
  for (const contract of baseContracts) {
    const count = contract.logCount || 20;
    for (let i = 0; i < count; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i * 3 - Math.floor(Math.random() * 5));

      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yy = String(date.getFullYear()).slice(-2);

      const duration = parseFloat((Math.random() * 4 + 0.5).toFixed(1));

      logs.push({
        LogID: `LOG-${logId.toString().padStart(5, '0')}`,
        ContractID: contract.id,
        Engineer: engineers[Math.floor(Math.random() * engineers.length)],
        Task: tasks[Math.floor(Math.random() * tasks.length)],
        Date: `${dd}/${mm}/${yy}`,
        Duration: `${duration} hrs`,
        Status: 'Completed',
        CreatedAt: date.toISOString()
      });
      logId++;
    }
  }

  return logs.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
}

// 生成工时细目
function generateHourLogsDetails(hourLogs) {
  const activities = [
    'Installation',
    'Testing',
    'Configuration',
    'Troubleshooting',
    'Maintenance',
    'Inspection',
    'Documentation',
    'Training',
    'Support',
    'Optimization'
  ];

  const details = [];
  let detailId = 1;

  // 为每个工时记录生成细目
  for (const log of hourLogs) {
    const duration = parseFloat(log.Duration);
    const activityCount = Math.ceil(duration / 1.5);

    for (let i = 0; i < activityCount; i++) {
      const hours = Math.min(1.5, duration - i * 1.5);
      const startHour = 8 + Math.floor(i * 1.5);
      const startMin = (i * 1.5 % 1) * 60;

      details.push({
        DetailID: `DET-${detailId.toString().padStart(6, '0')}`,
        LogID: log.LogID,
        Activity: activities[Math.floor(Math.random() * activities.length)],
        TaskCategory: 'Technical',
        StartTime: `${String(startHour).padStart(2, '0')}:${String(Math.floor(startMin)).padStart(2, '0')}`,
        EndTime: `${String(startHour + Math.floor(hours)).padStart(2, '0')}:${String(Math.floor((startMin + (hours % 1) * 60) % 60)).padStart(2, '0')}`,
        Hours: parseFloat(hours.toFixed(2)),
        Notes: 'Work completed successfully'
      });
      detailId++;
    }
  }

  return details;
}

function createExcelFile() {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Contracts
  const contractSheet = XLSX.utils.json_to_sheet(mockContracts);
  XLSX.utils.book_append_sheet(workbook, contractSheet, 'Contracts');

  // Sheet 2: ContractDetails
  const detailSheet = XLSX.utils.json_to_sheet(contractDetails);
  XLSX.utils.book_append_sheet(workbook, detailSheet, 'ContractDetails');

  // Sheet 3: ContractDocuments
  const docSheet = XLSX.utils.json_to_sheet(contractDocuments);
  XLSX.utils.book_append_sheet(workbook, docSheet, 'ContractDocuments');

  // Sheet 4: Contacts
  const contactSheet = XLSX.utils.json_to_sheet(contacts);
  XLSX.utils.book_append_sheet(workbook, contactSheet, 'Contacts');

  // Sheet 5: Equipment
  const equipmentData = generateEquipment();
  const equipmentSheet = XLSX.utils.json_to_sheet(equipmentData);
  XLSX.utils.book_append_sheet(workbook, equipmentSheet, 'Equipment');

  // Sheet 6: HourLogs
  const hourLogsData = generateHourLogs();
  const hourLogsSheet = XLSX.utils.json_to_sheet(hourLogsData);
  XLSX.utils.book_append_sheet(workbook, hourLogsSheet, 'HourLogs');

  // Sheet 7: HourLogsDetails
  const hourLogsDetailsData = generateHourLogsDetails(hourLogsData);
  const hourLogsDetailsSheet = XLSX.utils.json_to_sheet(hourLogsDetailsData);
  XLSX.utils.book_append_sheet(workbook, hourLogsDetailsSheet, 'HourLogsDetails');

  // 保存文件
  const publicDir = path.join(__dirname, '..', 'public');
  const filePath = path.join(publicDir, 'database.xlsx');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  XLSX.writeFile(workbook, filePath);
  
  console.log('\n✅ 优化版 Excel 数据库已创建！\n');
  console.log(`📁 文件位置: ${filePath}\n`);
  console.log('📊 数据统计:');
  console.log(`   • Contracts (合同): ${mockContracts.length} 条`);
  console.log(`   • ContractDetails (合同详情): ${contractDetails.length} 条`);
  console.log(`   • ContractDocuments (文档): ${contractDocuments.length} 个`);
  console.log(`   • Contacts (联系人): ${contacts.length} 人`);
  console.log(`   • Equipment (设备): ${equipmentData.length} 台`);
  console.log(`   • HourLogs (工时记录): ${hourLogsData.length} 条`);
  console.log(`   • HourLogsDetails (工时细目): ${hourLogsDetailsData.length} 条`);
  console.log('\n📋 Excel 表结构:');
  console.log('   1. Contracts - 合同基本信息 (客户、地址、有效期等)');
  console.log('   2. ContractDetails - 合同详细信息 (金额、服务内容、预算时长等)');
  console.log('   3. ContractDocuments - 合同文档 (PDF链接、上传时间等)');
  console.log('   4. Contacts - 联系人信息 (名字、职位、邮箱、电话等)');
  console.log('   5. Equipment - 设备清单 (型号、序列号、维保日期等)');
  console.log('   6. HourLogs - 工时记录 (日期、工程师、任务、时长等)');
  console.log('   7. HourLogsDetails - 工时细目 (活动、开始/结束时间、小时数)\n');
}

try {
  createExcelFile();
} catch (error) {
  console.error('❌ 创建 Excel 文件失败:', error);
  process.exit(1);
}
