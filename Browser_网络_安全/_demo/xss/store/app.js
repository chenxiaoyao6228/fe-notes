const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3211;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

let userInput = '';

app.post('/submit', (req, res) => {
  userInput = req.body.userInput;
  res.send('Data submitted successfully!, please go the link: http://localhost:3211/show  to see XSS attack' );
});

app.get('/show', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>XSS Demo</title>
    </head>
    <body>
      <h1>文章详情</h1>
      <p>${userInput}</p>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
