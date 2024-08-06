import express from "express";

const app = express();
const port = 3000;
const url = "http://localhost";

app.get("/", (req, res) => {
  res.send("Hello Client!");
});

app.listen(port, () => {
  console.log(`Server running on ${url}:${port}`);
});
