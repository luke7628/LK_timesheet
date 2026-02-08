
import { Contract, HourLog, StorageMode, SyncStatus } from '../types';
import { MOCK_CONTRACTS } from '../mockData';
import { ExcelService } from './excelService';

const STORAGE_KEY = 'contract_lookup_data';
const MODE_KEY = 'contract_storage_mode';

/**
 * 这是一个通用的数据提供者接口。
 * 未来你可以实现一个 'ExcelProvider' 或 'SupabaseProvider'。
 */
interface DataProvider {
  getContracts(): Promise<Contract[]>;
  saveContracts(contracts: Contract[]): Promise<void>;
  getMode(): StorageMode;
}

class LocalStorageProvider implements DataProvider {
  getMode(): StorageMode {
    return 'local';
  }

  async getContracts(): Promise<Contract[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return MOCK_CONTRACTS;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return MOCK_CONTRACTS;
    }
  }

  async saveContracts(contracts: Contract[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  }
}

class ExcelProvider implements DataProvider {
  getMode(): StorageMode {
    return 'excel';
  }

  async getContracts(): Promise<Contract[]> {
    // 尝试从缓存读取
    const cached = ExcelService.getFromCache();
    if (cached) {
      return cached;
    }
    // 如果没有缓存，返回空数组（需要用户上传 Excel）
    return [];
  }

  async saveContracts(contracts: Contract[]): Promise<void> {
    // 保存到缓存
    ExcelService.saveToCache(contracts);
  }
}

// 获取当前使用的模式
const getStorageMode = (): StorageMode => {
  const mode = localStorage.getItem(MODE_KEY);
  return (mode as StorageMode) || 'local';
};

// 设置存储模式
const setStorageMode = (mode: StorageMode): void => {
  localStorage.setItem(MODE_KEY, mode);
};

// 获取当前 Provider
const getCurrentProvider = (): DataProvider => {
  const mode = getStorageMode();
  return mode === 'excel' ? new ExcelProvider() : new LocalStorageProvider();
};

// 当前使用的 Provider
let currentProvider: DataProvider = getCurrentProvider();

export const apiService = {
  getMode: (): StorageMode => {
    return currentProvider.getMode();
  },

  setMode: (mode: StorageMode): void => {
    setStorageMode(mode);
    currentProvider = getCurrentProvider();
  },

  getSyncStatus: async (): Promise<SyncStatus> => {
    const mode = getStorageMode();
    const lastSync = mode === 'excel' 
      ? ExcelService.getLastSavedTime() 
      : localStorage.getItem(`${STORAGE_KEY}_last_sync`);
    
    return {
      lastSynced: lastSync,
      status: 'online',
      mode: mode
    };
  },

  getContracts: async (): Promise<Contract[]> => {
    // 模拟真实 API 延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    return await currentProvider.getContracts();
  },

  addHourLog: async (contractId: string, log: Partial<HourLog>, engineerName: string): Promise<Contract> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const contracts = await currentProvider.getContracts();
    const index = contracts.findIndex(c => c.id === contractId);
    
    if (index === -1) throw new Error("Contract not found");

    const now = new Date().toISOString();
    const newLog: HourLog = {
      id: `L-${Date.now()}`,
      engineer: engineerName.split(' ')[0],
      description: log.description || '',
      duration: log.duration?.includes('hrs') ? log.duration : `${log.duration} hrs`,
      date: log.date || new Date().toLocaleDateString('en-GB'),
      createdAt: now,
      updatedAt: now
    };

    const updatedContract: Contract = {
      ...contracts[index],
      hourLogs: [newLog, ...contracts[index].hourLogs],
      _lastSyncedAt: now
    };

    contracts[index] = updatedContract;
    await currentProvider.saveContracts(contracts);
    localStorage.setItem(`${STORAGE_KEY}_last_sync`, now);
    
    return updatedContract;
  },

  updateHourLog: async (contractId: string, logId: string, updatedFields: Partial<HourLog>): Promise<Contract> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const contracts = await currentProvider.getContracts();
    const cIndex = contracts.findIndex(c => c.id === contractId);
    if (cIndex === -1) throw new Error("Contract not found");

    const lIndex = contracts[cIndex].hourLogs.findIndex(l => l.id === logId);
    if (lIndex === -1) throw new Error("Log not found");

    const now = new Date().toISOString();
    contracts[cIndex].hourLogs[lIndex] = {
      ...contracts[cIndex].hourLogs[lIndex],
      ...updatedFields,
      updatedAt: now,
      duration: updatedFields.duration?.includes('hrs') ? updatedFields.duration : `${updatedFields.duration} hrs`
    };
    contracts[cIndex]._lastSyncedAt = now;

    await currentProvider.saveContracts(contracts);
    localStorage.setItem(`${STORAGE_KEY}_last_sync`, now);
    
    return contracts[cIndex];
  },

  resetData: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_last_sync`);
  },

  getDataSource: (): string => {
    const mode = getStorageMode();
    switch (mode) {
      case 'excel':
        return 'Excel File';
      case 'local':
        return 'Browser LocalStorage';
      default:
        return 'Unknown';
    }
  },

  // Excel 相关方法
  importFromExcel: async (file: File): Promise<Contract[]> => {
    const contracts = await ExcelService.readFromFile(file);
    setStorageMode('excel');
    currentProvider = getCurrentProvider();
    return contracts;
  },

  exportToExcel: (contracts: Contract[]): void => {
    ExcelService.exportToFile(contracts);
  },

  exportExcelTemplate: (): void => {
    ExcelService.exportTemplate();
  },

  switchToExcelMode: (): void => {
    setStorageMode('excel');
    currentProvider = getCurrentProvider();
  },

  switchToLocalMode: (): void => {
    setStorageMode('local');
    currentProvider = getCurrentProvider();
  }
};
