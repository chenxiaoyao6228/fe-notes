const express = require('express');
const app = express();


// 路由，用于处理JSONP请求
app.get('/api/jsonp', (req, res) => {
  const callbackFunction = req.query.callback;
  const data = { message: 'Hello, JSONP!' };

  // 将数据包装在回调函数中返回
  if (callbackFunction) {
    res.send(`${callbackFunction}(${JSON.stringify(data)})`);
  } else {
    res.json(data);
  }
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
