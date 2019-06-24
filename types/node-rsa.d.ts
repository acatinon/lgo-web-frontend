export = NodeRSA;
declare class NodeRSA {
  constructor(key?: any, format?: any, options?: any);
  $options: any;
  keyPair: any;
  $cache: any;
  $$decryptKey(usePublic: any, buffer: any, encoding: any): any;
  $$encryptKey(usePrivate: any, buffer: any, encoding: any, source_encoding: any): any;
  $getDataForEncrypt(buffer: any, encoding: any): any;
  $getDecryptedData(buffer: any, encoding: any): any;
  decrypt(buffer: any, encoding: any): any;
  decryptPublic(buffer: any, encoding: any): any;
  encrypt(buffer: any, encoding: any, source_encoding: any): any;
  encryptPrivate(buffer: any, encoding: any, source_encoding: any): any;
  exportKey(format: any): any;
  generateKeyPair(bits: any, exp: any): any;
  getKeySize(): any;
  getMaxMessageSize(): any;
  importKey(keyData: any, format: any): any;
  isEmpty(strict: any): any;
  isPrivate(): any;
  isPublic(strict: any): any;
  setOptions(options: any): void;
  sign(buffer: any, encoding: any, source_encoding: any): any;
  verify(buffer: any, signature: any, source_encoding: any, signature_encoding: any): any;
}
