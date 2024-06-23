import { IHTTPSMessage } from '@/interfaces/HTTPSMessageInterface';
export const OrderResponseType: IHTTPSMessage = {
  SUCCESS_CREATED: '建立訂單成功，你真棒！',
  SUCCESS_REQUEST: '成功獲取桌遊訂單信息！',
  SUCCESS_UPDATE: '成功更新桌遊訂單！',
  FAILED_VALIDATION: '驗證失敗，輸入數據不符合要求',
  FAILED_VALIDATION_EVENT_ID: '恩丟喔～活動的ID錯誤惹',
  FAILED_FOUND: '未找到訂單信息',
  FAILED_AUTHORIZATION:
    '未授權操作，該活動已下架用戶無權訪問，或用戶本身非訂單本人',
  FAILED_CREATION: '訂單創建失敗，可能原因包括：訂單並不在活動報名期間內。',
  FAILED_UPDATE: '更新桌遊訂單失敗，請再試一次。',
  FAILED_DELETION: '刪除失敗，無法刪除訂單',
  FAILED_OPERATION: '操作失敗，請稍後再試或聯繫卡咪',
  SYSTEM_ERROR: '伺服器錯誤，請問問卡咪吧。',
  UNKNOWN_ERROR: '未知錯誤，請稍後再試或聯繫卡咪',
  ERROR_PLAYER_FOUND: '未找到玩家信息',
  CREATED_ERROR_REGISTRATION_PERIOD: '訂單創建失敗，註冊期不在有效期內',
  CREATED_ERROR_MONEY: '訂單創建失敗，金額不符',
  CREATED_ERROR_EXCEEDS_CAPACITY: '訂單創建失敗，超出活動容量',
  BAD_REQUEST: '查詢失敗，可能原因包括：訂單並不在活動報名期間內。',
};
