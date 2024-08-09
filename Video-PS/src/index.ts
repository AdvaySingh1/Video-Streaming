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
// Needed for cloud run as it will turn off upon no requests (image with no container)
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
    return;
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  try {
    // download processed video
    await downloadRawVideo(inputFileName);

    // process the file
    await processVideo(inputFileName, outputFileName);

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
    return;
  }

  // delete all the videos
  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName),
  ]);

  res.status(200).send("Processing finished successfully.");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on ${url}:${port}`);
});
