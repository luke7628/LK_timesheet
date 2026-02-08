
export interface Equipment {
  id: string;
  sn: string;
  model: string;
  status: 'Active' | 'Inactive';
  installationDate?: string;
}

export interface HourLogBreakdown {
  id: string;
  logId: string;
  startTime: string;  // HH:mm format
  endTime: string;    // HH:mm format
  activity: string;
  hours: number;
  taskCategory: string;
}

export interface HourLog {
  id: string;
  engineer: string;
  description: string;
  duration: string;
  date: string;
  createdAt: string; // ISO string for sorting and DB sync
  updatedAt: string; // For conflict resolution
  breakdown?: HourLogBreakdown[];
}

export interface Contact {
  id?: string;
  name: string;
  role: string;
  position?: string;
  email: string;
  phone: string;
  department?: string;
}

export interface ContractDocument {
  id: string;
  contractId: string;
  documentName: string;
  documentType: string;
  fileLink: string;
  uploadDate: string;
  description: string;
}

export interface Contract {
  id: string;
  client: string;
  site: string;
  address?: string;
  expiresDate: string;
  systelineContractNumber?: string;
  contractNumber: string;
  contractPlan: string;
  contractType?: string;
  serviceContent: string;
  remainingHours: string;
  amount: string;
  status: 'Active' | 'Expired' | 'Pending';
  category: string;
  location: string;
  documents?: ContractDocument[];
  contacts: Contact[];
  equipment: Equipment[];
  hourLogs: HourLog[];
  createdDate?: string;
  lastModified?: string;
  _version?: number; // Optimistic locking for Excel/DB sync
  _lastSyncedAt?: string;
}

export enum View {
  SPLASH = 'splash',
  LIST = 'list',
  DETAILS = 'details',
  ADD_LOG = 'add_log',
  EDIT_LOG = 'edit_log',
  EQUIPMENT_LIST = 'equipment_list',
  HOUR_LOG_HISTORY = 'hour_log_history',
  CONTRACT_DOCUMENTS = 'contract_documents',
  PDF_VIEWER = 'pdf_viewer',
  LOGIN = 'login',
  PROFILE = 'profile'
}

export type StorageMode = 'local' | 'cloud' | 'excel';

export interface SyncStatus {
  lastSynced: string | null;
  status: 'online' | 'offline' | 'syncing' | 'error';
  mode: StorageMode;
}
