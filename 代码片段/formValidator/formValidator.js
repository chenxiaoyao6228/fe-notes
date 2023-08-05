import { curry, isFunction } from "lodash";

/**
 * 表单校验工具
 * @export
 * @param {*} [strategies={}]
 * @return {*}
 */
export default function (strategies = {}) {
  const validators = [];

  function getVaildator() {
    // 函数柯里化
    return curry(async function (vaildator, errMessage, value) {
      const pass = await vaildator(value);
      if (!pass) {
        return errMessage;
      } else {
        return null;
      }
    });
  }

  function add(check, errMessage) {
    let checkFun = null;

    if (!check || (!isFunction(check) && !strategies[check])) {
      console.error(
        `不存在名为 ${check} 的校验项，请检查函数formValidator的参数`
      );
      return false;
    }

    checkFun = isFunction(check) ? check : strategies[check];

    validators.push(getVaildator()(checkFun, errMessage || ""));
  }

  async function check(value) {
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i];
      const error = await validator(value);
      if (error) return error;
    }
    return null;
  }

  return {
    add,
    check,
  };
}
