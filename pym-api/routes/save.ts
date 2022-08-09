import multer from "multer";
import fs from "fs";
import * as crypto from "crypto";
import express, { Request, Response } from "express";
import { Post } from "../models/Post";

const router = express.Router();

interface Body {
  group: string;
  value: string | null;
  language: string | null;
}

type mimetype = "text/plain" | "text/x-c" | "text/x-python" | "text/x-python-script" | "text/javascript"
const mimeTypes = ["image/jpeg", "image/png", "image/heic"];

const textMimeTypes = {
  "text/plain": "plaintext",
  "text/x-c": "c",
  "text/x-python": "python",
  "text/x-python-script": "python",
  "text/javascript": "javascript",
}

/* Multer (file upload) configuration */
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, "uploads/");
  },
  // Custom file name
  filename: (req: any, file: { originalname: string; }, cb: (arg0: null, arg1: string) => void) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filtering
const fileFilter = (req: any, file: { mimetype: string; }, cb: (arg0: null, arg1: boolean) => void) => {
  // If the submitted file mime type is accepted
  console.log(file.mimetype)
  if (mimeTypes.includes(file.mimetype) || file.mimetype in textMimeTypes) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    // 20 mb
    fileSize: 20971520,
  },
  fileFilter: fileFilter,
});
/**************************************/


// Function to find the SHA256 hash of the file
const hashFile = (content: any) => {
  const hashSum = crypto.createHash("sha256");
  hashSum.update(content);
  return hashSum.digest("hex");
};

// Function to update the expiration time
function updateExpire() {
  var date = new Date(); // Now
  date.setDate(date.getDate() + 15); // Set now + 15 days as the new date
  return date;
}

// Function to check if the hex digest of newly uploaded file is already in the database
async function checkHash(hexDigest: any, file: any) {
  try {
    const post = await Post.findOne({ hash: hexDigest });
    if (post) {
      // If the hash already exists then delete the newly uploaded file
      if (file) {
        fs.unlink("/usr/src/app/" + file.path, (err) => {
          if (err) console.log(err);
        })
      }
      return post.shortId;
    }
    // If hash content does not exist then return null
    return null;
  } catch (e) {
    console.log(e);
  }
}

// Function to handle if the user uploads a file
async function handleFile(hexDigest: string, file: any, response: Response) {
  // If the file is a text (or code file) then treat it as a text post
  let fileBuffer = ""
  if (file.mimetype in textMimeTypes) {
    fileBuffer = fs.readFileSync(process.env.URL + file.path).toString();
  }
  Post.create({
    expireAt: updateExpire(),
    group: fileBuffer ? "text" : "image",
    value: fileBuffer ? fileBuffer : file.path,
    hash: hexDigest,
    language: textMimeTypes[file.mimetype as mimetype],
  })
    .then((res: { shortId: string; }) => {
      console.log(res);
      return response.status(200).json({ shortId: res.shortId });
    })
    .catch((e: string) => {
      console.log("error: " + e);
    });
}

// Function to handle if user pastes text
async function handleText(hexDigest: string, body: { group: any; value: any; language: any; }, response: Response) {
  Post.create({
    expireAt: updateExpire(),
    group: body.group,
    value: body.value,
    hash: hexDigest,
    language: body.language,
  })
    .then((res: { shortId: string; }) => {
      console.log(res);
      return response.status(200).json({ shortId: res.shortId });
    })
    .catch((e: string) => {
      console.log("error: " + e);
    });
}
// API Endpoint for uploading an image
router.post("/", upload.single("files"), async (req: Request, response: Response) => {
  // Hashing the file to see if post already exists in the database
  const fileBuffer = req.file ? fs.readFileSync(process.env.URL + req.file.path) : req.body.value;
  if (!fileBuffer) return response.status(400);
  const hexDigest = hashFile(fileBuffer);
  const shortId = await checkHash(hexDigest, req.file);
  // If the shortId exists for the hash contents of the file then return it
  if (shortId) {
    console.log("shortId: " + shortId);
    return response.status(200).json({ shortId: shortId })
  } else {
    if (req.file) await handleFile(hexDigest, req.file, response);
    else await handleText(hexDigest, req.body, response);
  }
});

export { router as saveRouter }
