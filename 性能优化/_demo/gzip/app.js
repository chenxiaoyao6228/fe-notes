const express = require('express');
const compression = require('compression');
const fs = require('fs');

const app = express();
const port = 3000;

// Use compression middleware only for the /gzip route
app.use('/gzip', compression());

app.get('/', (req, res) => {
  // Return the non-Gzip version
  res.sendFile('public/index.html', { root: __dirname });
});

app.get('/gzip', (req, res) => {
  // Return the Gzip version
  res.sendFile('public/index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
