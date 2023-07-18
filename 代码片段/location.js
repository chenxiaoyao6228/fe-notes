import { isString, isArray, pick } from "lodash";

/**
 * 更新地址栏查询参数
 * @param {Object} [params={}] 参数列表
 * @returns 更新后的path
 */
export function updateQueryParams(params = {}) {
  const { pathname, hash, search } = window.location;
  const searchParams = new URLSearchParams(search);
  const paramsEntires = Object.entries(params);

  for (let [key, value] of paramsEntires) {
    if (!value) {
      searchParams.delete(key);
      continue;
    }
    searchParams.set(key, value);
  }
  const newSearch = searchParams.toString();
  const nextUrl = pathname + (newSearch ? "?" + newSearch : "") + hash;

  if (paramsEntires.length) {
    window.history.pushState({}, "", nextUrl);
  }

  return nextUrl;
}

/**
 * 传入多个相同key，采用最后一个
 * @param {string|string[]} query 可选
 * @returns
 */
export function getURLSearchParams(query) {
  const searchParams = new URLSearchParams(window.location.search).entries();
  const result = [...searchParams].reduce((obj, curr) => {
    obj[curr[0]] = curr[1];
    return obj;
  }, {});

  if (isString(query)) {
    return result[query];
  }

  if (isArray(query)) {
    return pick(result, query);
  }

  return result;
}
