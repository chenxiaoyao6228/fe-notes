import { getAbsPath } from "./util";
import  contextInstance  from "./context";

// require的执行时机是在factory里面，此时应该是parent以及deps全部加载完成才会执行该方法
export function require(id) {
  const module = contextInstance.getModule(getAbsPath(id));

  if(!module){
    throw new Error(`module ${getAbsPath(id)} is not found`)
  }
  return module.getExports();
}

