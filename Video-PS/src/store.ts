import { Storage } from "@google-cloud/storage";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

// Create client using default Application credentials
const storage = new Storage(); // storage object in heap. Self delition operator

// Creates store with projectID and a client from a Google service account key
// const storage = new Storage({
//   projectId: "your-project-id",
//   keyFilename: "/path/to/keyfile.json",
//   credentials: {}
// });

// Cloud Storage Buckets
const loadBucketName = "vl-bucket625";
const processedBucketName = "pl-bucket625";

// Local directories during proccessing
const rawVideoPath = "./raw-videos";
const proVideoPath = "./pro-videos";

/**
 * Create dirs for raw and processed videos
 */
export function setupDirectories() {
  ensureDirectoryExistence(rawVideoPath);
  ensureDirectoryExistence(proVideoPath);
}

/**
 * Process the raw video from raw videos path into the proccessed cideo in pro-videos.
 * @param {string} rawVideoName - raw video to process.
 * @param {string} proccessedVideoName - proccessed video name.
 */
export function processVideo(
  rawVideoName: string,
  proccessedVideoName: string
) {
  const inputFilePath = `${rawVideoPath}/${rawVideoName}`;
  const outputFilePath = `${proVideoPath}/${proccessedVideoName}`;
  return new Promise<void>((resolve, reject) => {
    // Create the ffmpeg command
    ffmpeg(inputFilePath)
      .outputOptions("-vf", "scale=ceil(iw/2)*2:360") // 360p
      .on("end", function () {
        // on makes it naturally async
        console.log("Processing finished successfully");
        resolve();
      })
      .on("error", function (err: any) {
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .save(outputFilePath);
  });
}

/**
 * Download the raw video from google cloud storage raw bucket into raw video dir.
 * @param {string} rawVideoName - Raw video to download from GC bucker.
 * {@link loadBucketName} downloaded into into {@link rawVideoPath}.
 */
export async function downloadRawVideo(rawVideoName: string) {
  const rawFilePath = `${rawVideoPath}/${rawVideoName}`;
  const bucket = storage
    .bucket(loadBucketName)
    .file(rawVideoName)
    .download({ destination: rawFilePath });
  console.log(`gs://${rawVideoName} downloaded to ${rawFilePath}.`);
}

/**
 * Export the processed from proccessed video dir into google cloud processed bucket.
 * @param {string} proccessedVideoName - Processed video to export.
 * {@link proccessedVideoName} uplaoded from {@link proVideoPath}
 * into {@link processedBucketName}.
 */
export async function exportProcessedVideo(proccessedVideoName: string) {
  // upload
  const processedVideoPath = `${proVideoPath}/${proccessedVideoName}`;
  await storage
    .bucket(processedBucketName)
    .upload(processedVideoPath, { destination: proccessedVideoName });

  console.log(`${processedVideoPath} uploaded to gs://${processedBucketName}.`);

  // make publicly readeble (Subject to ACLs).
  await storage
    .bucket(processedBucketName)
    .file(proccessedVideoName)
    .makePublic();
}

/**
 * Delete raw video from raw video dir.
 * @param {string} rawVideoName - Raw video to delete from raw dir.
 */
export function deleteRawVideo(rawVideoName: string) {
  deleteFile(`${rawVideoPath}/${rawVideoName}`);
}

/**
 * Delete processed video from proccessed dir.
 * @param {string} proccessedVideoName - Processed video to delete from proccessed dir.
 */
export function deleteProcessedVideo(proccessedVideoName: string) {
  deleteFile(`${proVideoPath}/${proccessedVideoName}`);
}

/**
 * Delete file path in sync promise.
 * @param {string} filePath to delete
 */
function deleteFile(filePath: string) {
  new Promise<void>((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Failed to delete ${filePath}`);
          reject();
        } else {
          console.log(`Deleted file at ${filePath}`);
          resolve();
        }
      });
    } else {
      console.log(`File not found at ${filePath}. Skipping delete.`);
      resolve();
    }
  });
}

/**
 * Check to see if a file exists. If not, creates the file.
 * Synchronous funtion.
 * @param {string} dirPath - the file path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    // create file. Allowing for nested file dirs.
    fs.mkdirSync(dirPath, { recursive: true });

    console.log(`Directory created at ${dirPath}`);
  }
}
