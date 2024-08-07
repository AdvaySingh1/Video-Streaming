import express from "express";
import path from "path";
import dotenv from "dotenv";
import Ffmpeg from "fluent-ffmpeg";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const url = "http://localhost";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on ${url}:${port}`);
});
