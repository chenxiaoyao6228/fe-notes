const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/long-polling-endpoint', (req, res) => {
    // 模拟异步数据获取，实际应用中可以替换为真实数据源
    setTimeout(() => {
        // 响应客户端
        res.send('Data from server at ' + new Date());
    }, 5000); // 模拟数据每5秒更新一次
});

const port = 3456;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
