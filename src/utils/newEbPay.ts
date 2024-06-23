import crypto from 'crypto';

type TradeInfo = {
  MerchantOrderNo: string;
  TimeStamp: number;
  Amt: number;
  ItemDesc: string;
};

// 字串組合
export function genDataChain(order: TradeInfo) {
  const { MerchantID, Version, RespondType, ReturnUrl } = process.env;
  console.log(MerchantID, Version, RespondType, ReturnUrl);

  if (!MerchantID || !Version || !RespondType || !ReturnUrl)
    throw new Error('Missing required environment variables');

  /**
     * &NotifyURL=${encodeURIComponent(
            NotifyUrl,
        )}
     */
  return `MerchantID=${MerchantID}&TimeStamp=${
    order.TimeStamp
  }&Version=${Version}&RespondType=${RespondType}&MerchantOrderNo=${
    order.MerchantOrderNo
  }&Amt=${order.Amt}&ReturnURL=${encodeURIComponent(ReturnUrl)}&ItemDesc=${encodeURIComponent(
    order.ItemDesc,
  )}`;
}

// 對應文件 P17：使用 aes 加密
// $edata1=bin2hex(openssl_encrypt($data1, "AES-256-CBC", $key, OPENSSL_RAW_DATA, $iv));
export function createSesEncrypt(TradeInfo: TradeInfo) {
  const { HASHKEY, HASHIV } = process.env;
  if (!HASHKEY || !HASHIV)
    throw new Error('Missing required environment variables');
  const encrypt = crypto.createCipheriv('aes-256-cbc', HASHKEY, HASHIV);
  const enc = encrypt.update(genDataChain(TradeInfo), 'utf8', 'hex');
  return enc + encrypt.final('hex');
}

// 對應文件 P18：使用 sha256 加密
// $hashs="HashKey=".$key."&".$edata1."&HashIV=".$iv;
export function createShaEncrypt(aesEncrypt: string) {
  const { HASHKEY, HASHIV } = process.env;
  if (!HASHKEY || !HASHIV)
    throw new Error('Missing required environment variables');
  const sha = crypto.createHash('sha256');
  const plainText = `HashKey=${HASHKEY}&${aesEncrypt}&HashIV=${HASHIV}`;

  return sha.update(plainText).digest('hex').toUpperCase();
}

// 對應文件 21, 22 頁：將 aes 解密
export function createSesDecrypt(encryptedTradeInfo: string) {
  const { HASHKEY, HASHIV } = process.env;
  if (!HASHKEY || !HASHIV)
    throw new Error('Missing required environment variables');
  const decrypt = crypto.createDecipheriv('aes256', HASHKEY, HASHIV);
  decrypt.setAutoPadding(false);
  const text = decrypt.update(encryptedTradeInfo, 'hex', 'utf8');
  const plainText = text + decrypt.final('utf8');
  const result = plainText.replace(/[\x00-\x20]+/g, '');
  return JSON.parse(result);
}
