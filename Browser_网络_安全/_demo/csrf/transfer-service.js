// 模拟转账服务

const express = require('express');
const bodyParser = require('body-parser');

const transferApp = express();

const {transferServicePort} = require('./constant')

// 中间件允许跨域请求
transferApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 允许所有域名访问，生产环境中请更具体配置
  res.header('Access-Control-Allow-Methods', 'OPTIONS, POST'); // 允许的请求方法
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, CSRF-Token'); // 允许的请求头
  next();
});

transferApp.use(bodyParser.urlencoded({ extended: false }));

// 模拟处理转账请求的接口
transferApp.post('/transfer', (req, res) => {
   const { toAccount, amount } = req.body;

  // 模拟复杂的转账逻辑，此处只是简单的演示
  if (toAccount === 'receiver' && amount === '100') {
    res.status(200).send(`转账服务: localhost:${transferServicePort}, 转账成功, 金额为 ${amount}`);
  } else {
    res.status(400).send('转账失败，收款账户或金额错误');
  }
});


transferApp.listen(transferServicePort, () => {
  console.log(`Transfer service is running on http://localhost:${transferServicePort}`);
});
