const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.setHeader("Connection", "close");
  res.send("hello world");
});

app.listen(4000, () => {
  console.log("server is running at http://localhost:4000");
});
