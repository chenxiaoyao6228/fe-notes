const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/beforeunload.html');
});

// Define different API routes for handling requests
app.post('/api/xhr', (req, res) => {
  console.log('XHR Request Received');
  res.sendStatus(200);
});

app.post('/api/image', (req, res) => {
  console.log('Image Request Received');
  res.sendStatus(200);
});

app.post('/api/sendBeacon', (req, res) => {
  console.log('sendBeacon Request Received');
  res.sendStatus(200);
});

app.post('/api/fetch', (req, res) => {
  console.log('Fetch Request Received');
  res.sendStatus(200);
});

app.post('/api/keepalive', (req, res) => {
  console.log('Keepalive Request Received');
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
