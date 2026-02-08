
import { Contract, HourLog } from './types';

// Helper to generate logs
const generateLogs = (count: number, client: string): HourLog[] => {
  // Simplified to first names only
  const engineers = ['Alex', 'Jordan', 'Sarah', 'Marcus', 'Sam', 'Elena', 'James', 'Linda', 'Sophie', 'Tom', 'Gary', 'Emily', 'Ray', 'Jane', 'Leo'];
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
  
  const logs: HourLog[] = [];
  const baseDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i * 3 - Math.floor(Math.random() * 5));
    
    // Format to DD/MM/YY
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    
    // Fix: Added missing createdAt and updatedAt properties required by the HourLog interface
    logs.push({
      id: `log-${client}-${i}`,
      engineer: engineers[Math.floor(Math.random() * engineers.length)],
      description: tasks[Math.floor(Math.random() * tasks.length)],
      duration: `${(Math.random() * 4 + 0.5).toFixed(1)} hrs`,
      date: `${dd}/${mm}/${yy}`,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString()
    });
  }
  return logs;
};

export const MOCK_CONTRACTS: Contract[] = [
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
    equipment: [
      { sn: '998877', model: 'AHU-200X', status: 'Active' },
      { sn: '112233', model: 'CT-500', status: 'Inactive' }
    ],
    hourLogs: generateLogs(25, 'Acme')
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
    equipment: [],
    hourLogs: generateLogs(18, 'BioGreen')
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
    contacts: [{ name: 'James Bolt', role: 'CEO', email: 'j.bolt@boltsystems.com', phone: '555-0301' }],
    equipment: [],
    hourLogs: generateLogs(30, 'Bolt')
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
    contacts: [{ name: 'Linda Waters', role: 'Operations Chief', email: 'linda@clearwater.com', phone: '555-0401' }],
    equipment: [],
    hourLogs: generateLogs(22, 'ClearWater')
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
    contacts: [{ name: 'Sophie Design', role: 'Creative Director', email: 'sophie@designify.com', phone: '555-0501' }],
    equipment: [],
    hourLogs: generateLogs(15, 'Designify')
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
    contacts: [{ name: 'Tom Retailer', role: 'Store Lead', email: 'tom@echo.com', phone: '555-0601' }],
    equipment: [],
    hourLogs: generateLogs(20, 'Echo')
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
    contacts: [{ name: 'Gary Trucker', role: 'Logistics Manager', email: 'gary@future.com', phone: '555-0701' }],
    equipment: [],
    hourLogs: generateLogs(45, 'Future')
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
    contacts: [{ name: 'Dr. Emily Smith', role: 'IT Health Chief', email: 'emily@gh.org', phone: '555-0801' }],
    equipment: [],
    hourLogs: generateLogs(12, 'Global')
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
    contacts: [{ name: 'Ray Volt', role: 'Field Lead', email: 'ray@horizon.com', phone: '555-0901' }],
    equipment: [],
    hourLogs: generateLogs(28, 'Horizon')
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
    contacts: [{ name: 'Jane Innova', role: 'Lab Director', email: 'jane@innova.io', phone: '555-1001' }],
    equipment: [],
    hourLogs: generateLogs(14, 'Innova')
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
    contacts: [{ name: 'Leo Wing', role: 'Aviation IT', email: 'leo@jetstream.com', phone: '555-1101' }],
    equipment: [],
    hourLogs: generateLogs(50, 'JetStream')
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
    contacts: [{ name: 'Agent K', role: 'Security Chief', email: 'k@krypton.com', phone: '555-0007' }],
    equipment: [],
    hourLogs: generateLogs(35, 'Krypton')
  }
];
