// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const {transferServicePort} = require('./constant')

const app = express();

// 使用中间件解析请求体和处理Cookie
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 使用CSRF中间件
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);


// 模拟存在CSRF漏洞的页面，使用图片触发POST请求
app.get('/risk', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken();
  const imagePath = 'https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/cat-movie-thumbnail.png'

    res.send(`
    <html>
      <body>
        <h1>有风险的页面</h1>
        <img width="300" height="300" src="${imagePath}" alt="美女图片" onclick="sendAjaxRequest('${csrfToken}')">

        <script>
          function sendAjaxRequest(csrfToken) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:4000/transfer', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('CSRF-Token', csrfToken); // 添加CSRF token到请求头

            // 构造POST请求的参数，这里可以根据需要修改
            const params = 'toAccount=receiver&amount=100';

            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  window.alert(xhr.responseText);
                } else {
                  window.alert(xhr.responseText);
                }
              }
            };

            xhr.send(params);
          }
        </script>
      </body>
    </html>
  `);
});

// 模拟CSRF Token已添加的页面
app.get('/csrf-token', csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken();
  res.send(`
    <html>
      <body>
        <h1>包含CSRF Token的页面</h1>
        <form action="http://localhost:${transferServicePort}/transfer" method="post">
          <input type="hidden" name="_csrf" value="${csrfToken}">
          <label for="toAccount">收款账户:</label>
          <input type="text" id="toAccount" name="toAccount" required>
          <br>
          <label for="amount">转账金额:</label>
          <input type="text" id="amount" name="amount" required>
          <br>
          <button type="submit">确认转账</button>
        </form>
      </body>
    </html>
  `);
});

// 模拟SameSite Cookie属性已处理的页面
app.get('/samesite', (req, res) => {
  // 设置SameSite属性为Strict，以防范CSRF攻击
  res.cookie('myCookie', 'myValue', { sameSite: 'Strict' });
  res.send(`
    <html>
      <body>
        <h1>包含SameSite Cookie属性的页面</h1>
        <p>Cookie已设置SameSite属性为Strict</p>
      </body>
    </html>
  `);
});


// 启动服务器
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
