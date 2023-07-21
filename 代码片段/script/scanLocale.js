// 匹配所有的jsx文件，查找项目中的中文遗漏文案
const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");

const srcFolderPath = path.join(__dirname, "../src");

function isCommentLine(line) {
  return (
    line.trim().includes("//") || // 单行注释
    line.trim().includes("/*") || // 多行注释开始
    line.trim().includes("* ") || // 多行注释中间
    line.trim().includes("{/*") || // 类似 "{/* 分割线 2 */}" 的附加注释
    line.trim().includes("*/}") || // 多行注释结束
    line.includes("console") // 忽略包含 console.log 的行
  );
}

function findChineseCharacters(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split("\n");

  const chineseRegex = /[\u4E00-\u9FFF]/; // 匹配中文字符

  lines.forEach((line, lineNumber) => {
    if (!isCommentLine(line) && chineseRegex.test(line)) {
      console.log(`${filePath}:${lineNumber + 1}: ${line.trim()}`);
    }
  });
}

function scanTSXFiles(directoryPath) {
  const files = fg.sync("**/*.tsx", {
    cwd: directoryPath,
    nodir: true,
  });

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    findChineseCharacters(filePath);
  });
}

scanTSXFiles(srcFolderPath);
