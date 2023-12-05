const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

// SSE endpoint实时更新
app.get('/sse-endpoint', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 读取CICD日志文件，并将每一行作为单独的SSE事件每0.5秒发送一次
    const logFilePath = path.join(__dirname, 'public', 'cicd-log.txt');
    let lineIndex = 0;

    const sendBuildInfoInterval = setInterval(() => {
        const logLines = fs.readFileSync(logFilePath, 'utf-8').split('\n').filter(Boolean);
        if (lineIndex < logLines.length) {
            res.write(`data: ${logLines[lineIndex]}\n\n`);
            lineIndex++;
        } else {
            clearInterval(sendBuildInfoInterval);
            res.end();
        }
    }, 500);

    // 当客户端断开连接时，清除定时器
    req.on('close', () => {
        clearInterval(sendBuildInfoInterval);
        console.log('Client disconnected');
    });
});

const PORT = 12345;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
