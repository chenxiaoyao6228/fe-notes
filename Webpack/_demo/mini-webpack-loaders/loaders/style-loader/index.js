
module.exports = function (source) {
  console.log("style-loader", source);

  const cssSource = source.match(/(?<=__CSS_SOURCE__)((.|\s)*?)(?=\*\/)/g); // 获取 CSS 资源字符串
  const classKeyMap = source.match(/(?<=__CSS_CLASSKEYMAP__)((.|\s)*?)(?=\*\/)/g); // 获取 CSS 类名 Map
  
  console.log("classKeyMap", classKeyMap);

  const script = `
    var style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(cssSource)};
    document.head.appendChild(style);
    
    // Export classKeyMap if available
    ${classKeyMap !== null ? `module.exports = ${classKeyMap}` : ''}
  `;
  
  return script;
};