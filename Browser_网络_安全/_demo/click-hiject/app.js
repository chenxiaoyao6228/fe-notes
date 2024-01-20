// app.js (运行在3000端口)
const express = require("express");
const app = express();

app.get("/source", (req, res) => {
  res.send(`
    <html>
     <head>
        <style>
          button {
            width: 300px;
            height: 300px;
          }
        </style>
        </head>
      <body>
        <h1>源页面</h1>
        <button onclick="performAction()">点击执行转账操作</button>
        <script>
          function performAction() {
            alert("执行了源页面的转账操作！");
          }
        </script>
      </body>
    </html>
  `);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Source Server is running on http://localhost:${port}`);
});
