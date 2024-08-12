/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import {initializeApp, applicationDefault} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

initializeApp({
  credential: applicationDefault(),
});

// initializeApp(); // uses our login info from CLI and the hosting in CLI

const firestore = getFirestore();

// const firestore = new Firestore(); // create firestore object

export const createUser = functions.auth.user().onCreate(async (user) => {
  logger.info("Function triggered for user creation.");
  const userInfo = {
    uid: user.uid,
    email: user.email,
    protoUrl: user.photoURL,
  };

  try {
    await firestore.collection("users").doc(user.uid).set(userInfo);
    logger.info(`User created. User data: ${JSON.stringify(userInfo)}`);
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
  }
});

export const testCreateUser = functions.https.onRequest(async (req, res) => {
  const testUser = {
    uid: "testUid",
    email: "testEmail",
    protoUrl: "testPhotoURL",
  };

  try {
    await firestore.collection("users").doc("testUid").set(testUser);
    logger.info(`Test user created. User data: ${JSON.stringify(testUser)}`);
    res.status(200).send("Test user created.");
  } catch (error: any) {
    logger.error(`Error creating test user: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true }, {});
//   response.send("Hello from Firebase!");
// });
