import contextInstance from "./context.js";

export function loadScript(url) {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function parseDependency(fnString) {
  const deps = [];
  const reg = /require\((['"])(.+?)\1\)/g;
  let result = null;
  while ((result = reg.exec(fnString))) {
    deps.push(result[2]);
  }
  return deps;
}

export function getRootPath(){
  // 简单处理， 从index.html获取base
  let rootPath =  window.location.href.replace("/index.html", "");
  if(window.location.href.indexOf('html-preview') > -1){
    rootPath = rootPath.split("html-preview/?")[1];
  }
  return rootPath;
}


export function getAbsPath(id) {
  if(id.startsWith("http")){
    return id
  }

  const basePath = contextInstance.getConfig().base;
  const aliasPath = contextInstance.getConfig().alias[id];
  if (!aliasPath) {
    throw new Error(`模块${id}不存在`);
  }
  return basePath + "/" + aliasPath + ".js";
}


export function getCurrentScriptSrc() {
  if (document.currentScript) {
    return document.currentScript.src;
  }
  return "";
}
