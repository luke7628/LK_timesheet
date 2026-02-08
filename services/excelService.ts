import * as XLSX from 'xlsx';
import { Contract, HourLog, Equipment, Contact, ContractDocument, HourLogBreakdown } from '../types';

/**
 * 改进的 Excel 服务 - 处理 7 个优化 Sheet 的 Excel 文件读取和写入
 * 
 * Excel 文件结构（优化版）：
 * Sheet 1: Contracts - 合同基本信息
 * Sheet 2: ContractDetails - 合同详细信息
 * Sheet 3: ContractDocuments - 合同文档/PDF
 * Sheet 4: Contacts - 联系人信息
 * Sheet 5: Equipment - 设备清单
 * Sheet 6: HourLogs - 工时记录
 * Sheet 7: HourLogsDetails - 工时细目
 */

const EXCEL_FILE_KEY = 'contract_excel_data_v2';
const EXCEL_FILENAME = 'timesheet_database.xlsx';

export class ExcelService {
  /**
   * 从 Excel 文件读取所有数据（新的 7 Sheet 结构）
   */
  static async readFromFile(file: File): Promise<Contract[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const contracts = this.parseWorkbookV2(workbook);
          
          // 保存到 localStorage 作为缓存
          localStorage.setItem(EXCEL_FILE_KEY, JSON.stringify(contracts));
          localStorage.setItem(`${EXCEL_FILE_KEY}_last_loaded`, new Date().toISOString());
          
          resolve(contracts);
        } catch (error) {
          reject(new Error(`解析 Excel 文件失败: ${error}`));
        }
      };
      
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * 从 localStorage 读取缓存的数据
   */
  static getFromCache(): Contract[] | null {
    const cached = localStorage.getItem(EXCEL_FILE_KEY);
    if (!cached) return null;
    
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }

  /**
   * 解析新版本 workbook（7 个 Sheet）为 Contract 数组
   */
  private static parseWorkbookV2(workbook: XLSX.WorkBook): Contract[] {
    // 读取各个 sheet
    const contractsSheet = workbook.Sheets['Contracts'];
    const detailsSheet = workbook.Sheets['ContractDetails'];
    const documentsSheet = workbook.Sheets['ContractDocuments'];
    const contactsSheet = workbook.Sheets['Contacts'];
    const equipmentSheet = workbook.Sheets['Equipment'];
    const hourLogsSheet = workbook.Sheets['HourLogs'];
    const hourLogsDetailsSheet = workbook.Sheets['HourLogsDetails'];

    if (!contractsSheet) {
      throw new Error('Excel 文件中未找到 Contracts sheet');
    }

    // 转换为 JSON
    const contractRows = XLSX.utils.sheet_to_json(contractsSheet) as any[];
    const detailRows = detailsSheet ? XLSX.utils.sheet_to_json(detailsSheet) : [];
    const documentRows = documentsSheet ? XLSX.utils.sheet_to_json(documentsSheet) : [];
    const contactRows = contactsSheet ? XLSX.utils.sheet_to_json(contactsSheet) : [];
    const equipmentRows = equipmentSheet ? XLSX.utils.sheet_to_json(equipmentSheet) : [];
    const hourLogRows = hourLogsSheet ? XLSX.utils.sheet_to_json(hourLogsSheet) : [];
    const hourLogDetailRows = hourLogsDetailsSheet ? XLSX.utils.sheet_to_json(hourLogsDetailsSheet) : [];

    // 组装数据
    const contracts: Contract[] = contractRows.map((row: any) => {
      const contractId = row.ContractID || row.ID;

      // 获取合同详情
      const detail = (detailRows as any[]).find(d => d.ContractID === contractId) || {};

      // 获取文档列表
      const documents: ContractDocument[] = (documentRows as any[])
        .filter(d => d.ContractID === contractId)
        .map(d => ({
          id: d.DocumentID || `doc-${Date.now()}`,
          contractId: contractId,
          documentName: d.DocumentName || '',
          documentType: d.DocumentType || '',
          fileLink: d.FileLink || '',
          uploadDate: d.UploadDate || '',
          description: d.Description || ''
        }));

      // 获取联系人
      const contacts: Contact[] = (contactRows as any[])
        .filter(c => c.ContractID === contractId)
        .map(c => ({
          id: c.ContactID || `con-${Date.now()}`,
          name: c.Name || '',
          role: c.Position || c.Role || '',
          position: c.Position || '',
          email: c.Email || '',
          phone: c.Phone || '',
          department: c.Department || ''
        }));

      // 获取设备
      const equipment: Equipment[] = (equipmentRows as any[])
        .filter(e => e.ContractID === contractId)
        .map(e => ({
          id: e.EquipmentID || `eq-${Date.now()}`,
          sn: e.SerialNumber || '',
          model: e.Model || '',
          status: (e.Status as any) || 'Active',
          installationDate: e.InstallationDate || ''
        }));

      // 获取工时记录
      const hourLogs: HourLog[] = (hourLogRows as any[])
        .filter(l => l.ContractID === contractId)
        .map(l => {
          const logId = l.LogID || `log-${Date.now()}`;
          
          // 获取该工时记录的细目
          const breakdown: HourLogBreakdown[] = (hourLogDetailRows as any[])
            .filter(d => d.LogID === logId)
            .map(d => ({
              id: d.DetailID || `detail-${Date.now()}`,
              logId: logId,
              startTime: d.StartTime || '08:00',
              endTime: d.EndTime || '09:00',
              activity: d.Activity || '',
              hours: parseFloat(d.Hours) || 0,
              taskCategory: d.TaskCategory || 'Technical'
            }));

          return {
            id: logId,
            engineer: l.Engineer || '',
            description: l.Task || '',
            duration: l.Duration || '0 hrs',
            date: l.Date || '',
            createdAt: l.CreatedAt || new Date().toISOString(),
            updatedAt: l.CreatedAt || new Date().toISOString(),
            breakdown: breakdown.length > 0 ? breakdown : undefined
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        id: contractId,
        client: row.Client || '',
        site: row.Site || '',
        address: row.Address || '',
        expiresDate: row.ExpiresDate || row.EndDate || '',
        systelineContractNumber: row.SystelineContractNumber || '',
        contractNumber: row.ContractNumber || '',
        contractPlan: row.ContractType || detail.Category || '',
        contractType: row.ContractType || '',
        serviceContent: detail.ServiceContent || '',
        remainingHours: detail.RemainingHours || '0 hrs',
        amount: detail.ContractAmount || '$0',
        status: (row.Status as any) || 'Active',
        category: detail.Category || '',
        location: row.Site || '',
        documents: documents.length > 0 ? documents : undefined,
        contacts: contacts,
        equipment: equipment,
        hourLogs: hourLogs,
        createdDate: row.CreatedDate || '',
        lastModified: detail.LastModified || '',
        _lastSyncedAt: new Date().toISOString()
      };
    });

    return contracts;
  }

  /**
   * 导出数据到 Excel 文件（新的 7 Sheet 格式）
   */
  static exportToFile(contracts: Contract[]): void {
    const workbook = this.createWorkbookV2(contracts);
    
    // 生成 Excel 文件并下载
    XLSX.writeFile(workbook, EXCEL_FILENAME);
    
    // 更新缓存
    localStorage.setItem(EXCEL_FILE_KEY, JSON.stringify(contracts));
    localStorage.setItem(`${EXCEL_FILE_KEY}_last_saved`, new Date().toISOString());
  }

  /**
   * 创建新版本 Excel workbook（7 Sheet）
   */
  private static createWorkbookV2(contracts: Contract[]): XLSX.WorkBook {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Contracts (基本信息)
    const contractRows = contracts.map(c => ({
      ContractID: c.id,
      Client: c.client,
      Site: c.site,
      Address: c.address || '',
      Status: c.status,
      ExpiresDate: c.expiresDate,
      SystelineContractNumber: c.systelineContractNumber || '',
      ContractType: c.contractType || c.contractPlan,
      CreatedDate: c.createdDate || '',
      Notes: ''
    }));
    const contractSheet = XLSX.utils.json_to_sheet(contractRows);
    XLSX.utils.book_append_sheet(workbook, contractSheet, 'Contracts');

    // Sheet 2: ContractDetails (详细信息)
    const detailRows = contracts.map(c => ({
      ContractID: c.id,
      ServiceContent: c.serviceContent,
      ContractAmount: c.amount,
      RemainingHours: c.remainingHours,
      BudgetedHours: c.remainingHours, // 使用相同值作为示例
      HourlyRate: '', // 从金额和时长计算
      Category: c.category,
      LastModified: c.lastModified || new Date().toISOString()
    }));
    const detailSheet = XLSX.utils.json_to_sheet(detailRows);
    XLSX.utils.book_append_sheet(workbook, detailSheet, 'ContractDetails');

    // Sheet 3: ContractDocuments (文档)
    const documentRows: any[] = [];
    contracts.forEach(c => {
      if (c.documents) {
        c.documents.forEach(doc => {
          documentRows.push({
            DocumentID: doc.id,
            ContractID: c.id,
            DocumentName: doc.documentName,
            DocumentType: doc.documentType,
            FileLink: doc.fileLink,
            UploadDate: doc.uploadDate,
            Description: doc.description
          });
        });
      }
    });
    const documentSheet = XLSX.utils.json_to_sheet(documentRows);
    XLSX.utils.book_append_sheet(workbook, documentSheet, 'ContractDocuments');

    // Sheet 4: Contacts (联系人)
    const contactRows: any[] = [];
    contracts.forEach(c => {
      c.contacts.forEach((contact, idx) => {
        contactRows.push({
          ContactID: contact.id || `con-${c.id}-${idx}`,
          ContractID: c.id,
          Name: contact.name,
          Position: contact.position || contact.role,
          Department: contact.department || '',
          Email: contact.email,
          Phone: contact.phone,
          Mobile: contact.phone
        });
      });
    });
    const contactSheet = XLSX.utils.json_to_sheet(contactRows);
    XLSX.utils.book_append_sheet(workbook, contactSheet, 'Contacts');

    // Sheet 5: Equipment (设备)
    const equipmentRows: any[] = [];
    contracts.forEach(c => {
      c.equipment.forEach(eq => {
        equipmentRows.push({
          EquipmentID: eq.id,
          ContractID: c.id,
          SerialNumber: eq.sn,
          Model: eq.model,
          Manufacturer: '',
          Status: eq.status,
          InstallationDate: eq.installationDate || '',
          LastServiceDate: '',
          NextServiceDate: ''
        });
      });
    });
    const equipmentSheet = XLSX.utils.json_to_sheet(equipmentRows);
    XLSX.utils.book_append_sheet(workbook, equipmentSheet, 'Equipment');

    // Sheet 6: HourLogs (工时记录)
    const hourLogRows: any[] = [];
    contracts.forEach(c => {
      c.hourLogs.forEach(log => {
        hourLogRows.push({
          LogID: log.id,
          ContractID: c.id,
          Engineer: log.engineer,
          Task: log.description,
          Date: log.date,
          Duration: log.duration,
          Status: 'Completed',
          CreatedAt: log.createdAt
        });
      });
    });
    const hourLogSheet = XLSX.utils.json_to_sheet(hourLogRows);
    XLSX.utils.book_append_sheet(workbook, hourLogSheet, 'HourLogs');

    // Sheet 7: HourLogsDetails (工时细目)
    const hourLogDetailRows: any[] = [];
    contracts.forEach(c => {
      c.hourLogs.forEach(log => {
        if (log.breakdown) {
          log.breakdown.forEach(detail => {
            hourLogDetailRows.push({
              DetailID: detail.id,
              LogID: log.id,
              Activity: detail.activity,
              TaskCategory: detail.taskCategory,
              StartTime: detail.startTime,
              EndTime: detail.endTime,
              Hours: detail.hours,
              Notes: ''
            });
          });
        }
      });
    });
    const hourLogDetailSheet = XLSX.utils.json_to_sheet(hourLogDetailRows);
    XLSX.utils.book_append_sheet(workbook, hourLogDetailSheet, 'HourLogsDetails');

    return workbook;
  }

  /**
   * 将当前数据保存到缓存
   */
  static saveToCache(contracts: Contract[]): void {
    localStorage.setItem(EXCEL_FILE_KEY, JSON.stringify(contracts));
    localStorage.setItem(`${EXCEL_FILE_KEY}_last_saved`, new Date().toISOString());
  }

  /**
   * 清除缓存
   */
  static clearCache(): void {
    localStorage.removeItem(EXCEL_FILE_KEY);
    localStorage.removeItem(`${EXCEL_FILE_KEY}_last_loaded`);
    localStorage.removeItem(`${EXCEL_FILE_KEY}_last_saved`);
  }

  /**
   * 获取最后加载时间
   */
  static getLastLoadedTime(): string | null {
    return localStorage.getItem(`${EXCEL_FILE_KEY}_last_loaded`);
  }

  /**
   * 获取最后保存时间
   */
  static getLastSavedTime(): string | null {
    return localStorage.getItem(`${EXCEL_FILE_KEY}_last_saved`);
  }

  /**
   * 创建新版本示例 Excel 模板供用户下载
   */
  static exportTemplate(): void {
    // 创建一个简单的模板
    const workbook = XLSX.utils.book_new();

    // 只创建空的带有头部的 Sheet
    const headers = [
      { ContractID: '', Client: '', Site: '', Address: '', Status: '', 
        ExpiresDate: '', SystelineContractNumber: '', ContractType: '' }
    ];
    const detailHeaders = [
      { ContractID: '', ServiceContent: '', ContractAmount: '', RemainingHours: '',
        BudgetedHours: '', HourlyRate: '', Category: '', LastModified: '' }
    ];
    const docHeaders = [
      { DocumentID: '', ContractID: '', DocumentName: '', DocumentType: '',
        FileLink: '', UploadDate: '', Description: '' }
    ];
    const contactHeaders = [
      { ContactID: '', ContractID: '', Name: '', Position: '', Department: '',
        Email: '', Phone: '', Mobile: '' }
    ];
    const equipmentHeaders = [
      { EquipmentID: '', ContractID: '', SerialNumber: '', Model: '', Manufacturer: '',
        Status: '', InstallationDate: '', LastServiceDate: '', NextServiceDate: '' }
    ];
    const hourLogHeaders = [
      { LogID: '', ContractID: '', Engineer: '', Task: '', Date: '',
        Duration: '', Status: '', CreatedAt: '' }
    ];
    const detailHeaders2 = [
      { DetailID: '', LogID: '', Activity: '', TaskCategory: '',
        StartTime: '', EndTime: '', Hours: '', Notes: '' }
    ];

    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(headers), 'Contracts');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(detailHeaders), 'ContractDetails');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(docHeaders), 'ContractDocuments');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(contactHeaders), 'Contacts');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(equipmentHeaders), 'Equipment');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(hourLogHeaders), 'HourLogs');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(detailHeaders2), 'HourLogsDetails');

    XLSX.writeFile(workbook, 'timesheet_template.xlsx');
  }
}
