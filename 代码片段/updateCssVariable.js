// 获取根样式
function getRootStyle(variableName) {
  const rootStyles = getComputedStyle(document.documentElement);
  return rootStyles.getPropertyValue(variableName);
}

// 修改根样式
function changeRootStyle(variableName, newValue) {
  const rootStyles = document.documentElement.style;
  rootStyles.setProperty(variableName, newValue);
}
