const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const mimeTypes = ["image/jpeg", "image/png", "text/plain"];
const crypto = require("crypto");
const fs = require("fs");

/* Multer (file upload) configuration */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // Custom file name
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filtering
const fileFilter = (req, file, cb) => {
  // If the submitted file mime type is accepted
  if (mimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    // 5 mb
    fileSize: 5242880,
  },
  fileFilter: fileFilter,
});

// Function to find the SHA256 hash of the file
const hashFile = (content) => {
  const hashSum = crypto.createHash("sha256");
  hashSum.update(content);
  return hashSum.digest("hex");
};

// API Endpoint for uploading an image
router.post("/image", upload.single("files"), async (req, response) => {
  if (req.file) {
    try {
      // If file already exists then just return existing shortID
      const fileBuffer = fs.readFileSync("/usr/src/app/" + req.file.path);
      const hexDigest = hashFile(fileBuffer);
      Post.findOne({ hash: hexDigest })
        .then((res) => {
          // There was a post in the database with same hash so returning existing URL
          if (res) {
            return response.send(res.shortId);
          // There was no existing post with same hash so making new DB entry
          } else {
            Post.create({
              isImage: true,
              value: req.file.path,
              hash: hexDigest,
            })
              .then((res) => {
                return response.status(200).send(res.shortId);
              })
              .catch((e) => {
                console.log("error: " + e);
              });
          }
        })
        .catch((err) => {
          console.log("There was an error: " + err);
          return;
        });
    } catch (e) {
      console.log(e.message);
    }
  } else {
    console.log("not a file");
  }
});

// API Endpoint for uploading text/code
router.post("/", async (req, response) => {
  if (!req.body.value) return;
  try {
    const hexDigest = hashFile(req.body.value);
    // Try to find an existing DB entry with same hash
    Post.findOne({ hash: hexDigest })
      .then((res) => {
        // Hash found, return existing DB short ID
        if (res) {
          return response.status(200).json({"shortId": res.shortId});
        // Hash not found, make a new entry
        } else {
          Post.create({
            isImage: false,
            value: req.body.value,
            hash: hexDigest,
            language: req.body.language,
          })
            .then((res) => {
              return response.status(200).json({"shortId": res.shortId});
            })
            .catch((e) => {
              console.log("error: " + e);
            });
        }
      })
      .catch((err) => {
        console.log("There was an error: " + err);
      });
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
