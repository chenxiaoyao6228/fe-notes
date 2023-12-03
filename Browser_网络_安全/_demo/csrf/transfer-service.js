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

//  -------------------- 模拟处理转账请求的接口  -------------------
transferApp.post('/transfer', (req, res) => {
   const { toAccount, amount } = req.body;

  // 模拟复杂的转账逻辑，此处只是简单的演示
  if (toAccount === 'receiver' && amount === '100') {
    res.status(200).send(`转账服务: localhost:${transferServicePort}, 转账成功, 金额为 ${amount}`);
  } else {
    res.status(400).send('转账失败，收款账户或金额错误');
  }
});


// ------------ 模拟处理转账请求的接口 - 同时支持 Anti CSRF Token -----------
// 生成 CSRF Token 的函数
function generateCsrfToken() {
  // 这里简单地生成一个随机字符串作为 CSRF Token
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 存储 CSRF Token 的对象
const csrfTokens = {};
transferApp.post('/transfer-ant-csrf-token', (req, res) => {
  const { toAccount, amount, csrfToken } = req.body;

  // 验证CSRF token
  if (!csrfToken || csrfTokens[csrfToken] !== true) {
    return res.status(403).send('Invalid CSRF token');
  }

  // 模拟复杂的转账逻辑，此处只是简单的演示
  if (toAccount === 'receiver' && amount === '100') {
    res.status(200).send('转账成功');
  } else {
    res.status(400).send('转账失败，收款账户或金额错误');
  }
});



// 中间件：生成并存储 CSRF Token
transferApp.use((req, res, next) => {
  const csrfToken = generateCsrfToken();
  csrfTokens[csrfToken] = true;
  
  // 将 CSRF Token 存储在 Cookie 中，以便在客户端访问
  res.cookie('csrfToken', csrfToken, { httpOnly: true });

  // 将 CSRF Token 注入到模板中，用于表单中的隐藏字段
  res.locals.csrfToken = csrfToken;

  next();
});


transferApp.listen(transferServicePort, () => {
  console.log(`Transfer service is running on http://localhost:${transferServicePort}`);
});
