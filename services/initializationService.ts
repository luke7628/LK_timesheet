import { ExcelService } from './excelService';
import { apiService } from './apiService';

/**
 * 初始化服务 - 应用启动时加载本地 Excel 数据库
 */

export const initializationService = {
  /**
   * 初始化应用数据
   * 尝试从 public/database.xlsx 加载数据
   */
  async loadInitialData(): Promise<void> {
    try {
      const response = await fetch('/database.xlsx');
      
      if (!response.ok) {
        console.warn('未找到本地 Excel 数据库文件，将使用默认数据');
        return;
      }

      const buffer = await response.arrayBuffer();
      const file = new File([buffer], 'database.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // 通过 ExcelService 加载数据
      await ExcelService.readFromFile(file);
      apiService.switchToExcelMode();
      
      console.log('✅ 已从本地 database.xlsx 加载数据');
    } catch (error) {
      console.warn('加载本地Excel数据库失败，使用默认数据:', error);
    }
  }
};
