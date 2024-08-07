import express from "express";
import path from "path";
import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const url = "http://localhost";

app.post("/process-video", (req, res) => {
  // Get the path of the input video file from the request body
  const inputFilePath = path.join(__dirname, req.body.inputFilePath);
  //console.log(inputFilePath);
  const outputFilePath = path.join(__dirname, req.body.outputFilePath);

  // Check if the input file path is defined
  if (!inputFilePath || !outputFilePath) {
    return res.status(400).send("Bad Request: Missing file path");
  }

  // Create the ffmpeg command
  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=ceil(iw/2)*2:360") // 360p
    .on("end", function () {
      console.log("Processing finished successfully");
      res.status(200).send("Processing finished successfully");
    })
    .on("error", function (err: any) {
      console.log("An error occurred: " + err.message);
      res.status(500).send("An error occurred: " + err.message);
    })
    .save(outputFilePath);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on ${url}:${port}`);
});
