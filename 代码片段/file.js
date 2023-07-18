import { TypeFile } from "get-real-file-type";
import { isArray } from "lodash";

/**
 * 通过TypeFile回去File的真实类型
 * @param {File} file
 */
export function getRealFileType(file) {
  return new Promise((resolve, reject) => {
    const typeFile = new TypeFile(file); // 这里支持传入File实例/包含File实例的对象/Uint8Array
    typeFile.onParseEnd = function () {
      resolve(this);
    };
    typeFile.onParseError = function () {
      reject(this);
    };
    typeFile.start();
  });
}

/**
 * REAL_FIRST: 0 - 表示优先比较真实的文件信息
 * BROWSER_FIRST: 1 - 表示优先比较浏览器获取的文件信息
 * REAL_ONLY: 2 - 表示只比较真实的文件信息
 * BROWSER_ONLY: 3 - 表示只比较浏览器获取的文件信息
 * @param {blob|file} file
 * @param {string|string[]} type 比较的目标类型 https://github.com/sindresorhus/file-type/blob/master/supported.js#L139
 * @param {string} [compareType=TypeFile.COMPARE_TYPE.REAL_FIRST] 比较优先级
 * @returns
 */
export async function checkFileType(
  file,
  type,
  compareType = TypeFile.COMPARE_TYPE.REAL_FIRST
) {
  const res = await getRealFileType(file);
  const types = isArray(type) ? type : [type];

  return types.some((t) => res.isType(t, compareType));
}

/**
 * 将base64转换成二进制
 * @param {base64} dataURI
 * @returns blod
 */
export function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}
