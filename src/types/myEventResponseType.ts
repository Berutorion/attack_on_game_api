import { IHTTPSMessage } from '@/interfaces/HTTPSMessageInterface';
export const ResponseType: IHTTPSMessage = {
  SUCCESS_CREATED: '創建成功',
  SUCCESS_REQUEST: '請求成功',
  SUCCESS_UPDATE: '更新成功',
  FAILED_VALIDATION: '驗證失敗',
  FAILED_FOUND: '查找失敗',
  FAILED_AUTHORIZATION: '授權失敗',
  FAILED_CREATION: '創建失敗',
  FAILED_UPDATE: '更新失敗',
  FAILED_DELETION: '刪除失敗',
  FAILED_OPERATION: '操作失敗',
  FAILED_OWNER_FOUND: '沒有找到店家',
  SYSTEM_ERROR: '系統錯誤',
  UNKNOWN_ERROR: '未知錯誤',
};
