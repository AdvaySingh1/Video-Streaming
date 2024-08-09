import express from "express";
import path from "path";
import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import {
  setupDirectories,
  processVideo,
  deleteRawVideo,
  deleteProcessedVideo,
  downloadRawVideo,
  exportProcessedVideo,
} from "./store";

// config environment variables
dotenv.config();

// initialize the express application
const app = express();
// default to json middleware
app.use(express.json());

// set up directories for processing images
setupDirectories();

const port = process.env.PORT || 3001;
const url = "http://localhost";

// post endpoint accessed pub-sub is async
app.post("/process-video", async (req, res) => {
  // Endpoint will be accessed from pub-sub model.
  // Reference: https://cloud.google.com/run/docs/tutorials/pubsub#run_pubsub_server-nodejs
  let data;
  // parse the data into JSON format
  try {
    // buffer creates temporary data from req.body.nessage.data.
    // This is then converted into a string.
    const message = Buffer.from(req.body.message.data, "base64").toString(
      "utf8"
    );
    // Parse the data into JSON
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error("Invalid pub sub payload message.");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Bad request: missing filename.");
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  try {
    // download processed video
    await downloadRawVideo(inputFileName);

    // process the file
    processVideo(inputFileName, outputFileName);

    // upload the processed video
    await exportProcessedVideo(outputFileName);
  } catch (err) {
    // delete all the videos
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName),
    ]);

    // output the error message
    console.error(err);
    res.status(500).send(`Error in processing ${inputFileName}.`);
  }

  // delete all the videos
  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName),
  ]);

  res.status(200).send("Processing finished successfully.");
});

app.post("/video-process", (req, res) => {
  // Get the path of the input video file from the request body
  const inputFilePath = path.join(__dirname, "..", req.body.inputFilePath);
  //console.log(inputFilePath);
  const outputFilePath = path.join(__dirname, "..", req.body.outputFilePath);

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
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on ${url}:${port}`);
});
