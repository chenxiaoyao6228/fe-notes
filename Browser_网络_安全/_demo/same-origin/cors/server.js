const express = require('express');
const app = express();
const PORT = 3000;

// 中间件处理 CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5502'); // 更新为你的客户端的域
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Custom-Header');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header("Access-Control-Max-Age", "86400")
  next();
});

// 处理 CORS 启用的 GET 请求的路由
app.get('/api/data', (req, res) => {
  res.json({ data: '来自服务器的问候！' });
});


app.post('/api/data', (req, res) => {
  res.json({ data: '来自服务器的 POST 数据！' });
});

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
