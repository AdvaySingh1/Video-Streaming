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
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

initializeApp(); // uses our login info from CLI and the hosting in CLI

const firestore = new Firestore(); // create firestore object

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

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true }, {});
//   response.send("Hello from Firebase!");
// });
