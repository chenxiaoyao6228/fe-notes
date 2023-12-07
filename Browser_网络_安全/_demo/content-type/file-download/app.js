// nodejs app.js
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/download", (req, res) => {
  const fileName = req.query.file;

  // 根据文件名判断文件类型
  let contentType;
  if (fileName.endsWith(".txt")) {
    contentType = "text/plain";
  } else if (fileName.endsWith(".html")) {
    contentType = "text/html";
  } else if (fileName.endsWith(".pdf")) {
    contentType = "application/pdf";
  } else {
    // 默认为二进制数据
    contentType = "application/octet-stream";
  }

  const filePath = path.join(__dirname, "public", fileName);

  // 设置 Content-Disposition 头部，指定文件名
  if (fileName.endsWith(".pdf")) {
    // 预览pdf
    res.setHeader("Content-Disposition", `inline; filename=${fileName}`);
  } else {
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  }

  // 设置 Content-Type 头部，指定文件类型
  res.setHeader("Content-Type", contentType);

  // 发送文件
  res.sendFile(filePath);
});

const PORT = 3345;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
