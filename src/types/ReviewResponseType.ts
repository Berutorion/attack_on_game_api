import { IHTTPSMessage } from '@/interfaces/HTTPSMessageInterface';

export const ReviewResponseType: IHTTPSMessage = {
  SUCCESS_CREATED: '成功創建評論！',
  SUCCESS_REQUEST: '成功獲取評論信息！',
  SUCCESS_UPDATE: '成功更新評論信息！',
  FAILED_VALIDATION: '驗證失敗，輸入數據不符合要求',
  FAILED_FOUND: '未找到評論信息',
  FAILED_AUTHORIZATION: '未授權操作，用戶無權訪問',
  FAILED_CREATION: '評論創建失敗，請再試一次。',
  FAILED_UPDATE: '評論更新失敗，請再試一次。',
  FAILED_DELETION: '評論刪除失敗，無法刪除評論信息',
  FAILED_OPERATION: '操作失敗，請稍後再試或聯繫支持',
  SYSTEM_ERROR: '伺服器錯誤，請稍後再試或聯繫支持',
  UNKNOWN_ERROR: '未知錯誤，請稍後再試或聯繫支持',
  INVALID_REVIEW: '無效的評論信息，請檢查並重試',
  REVIEW_EXPIRED: '評論已過期，無法使用',
  REVIEW_ALREADY_USED: '評論已被使用，無法',
};
