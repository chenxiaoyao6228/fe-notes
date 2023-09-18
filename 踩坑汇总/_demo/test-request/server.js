const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/api/:requestType/:leaveAction', (req, res) => {
  const { requestType, leaveAction } = req.params;
  const logMessage = `Received ${requestType} request with leave action: ${leaveAction}\n`;

  fs.appendFile('server.log', logMessage, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(logMessage);
      res.status(200).send('Request received.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
