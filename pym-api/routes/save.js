const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const mimeTypes = ["image/jpeg", "image/png", "text/plain"];
const crypto = require("crypto");
const fs = require("fs");
const { res } = require("express");

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
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Function to find the SHA256 hash of the file
const hashFile = (content) => {
  const hashSum = crypto.createHash("sha256");
  hashSum.update(content);
  const hexDigest = hashSum.digest("hex");
  return hexDigest;
};

// Checks if the file already exists by checking the hash of the content
const checkHashFile = async (filePath) => {
  // Getting the hash of the file
  const hexDigest = hashFile("/usr/src/app/" + filePath);
  console.log("hex: " + hexDigest);
  // Try to find a post with the hash found
  Post.findOne({ hash: hexDigest })
    .then((res) => {
      console.log("res: " + res);
      if (res) {
        console.log("hit hit! there was a match");
        console.log("shortid: " + res.shortId);
        return res.shortId;
      } else {
        console.log("ummm db didnt find so making a new post");
        console.log(res);
        Post.create({
          isImage: true,
          image: req.file.path,
          hash: hexDigest,
        })
          .then((res) => {
            return res.shortId;
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
};

router.post("/image", upload.single("files"), async (req, response) => {
  if (req.file) {
    try {
      // If file already exists then just return existing shortID
      const fileBuffer = fs.readFileSync("/usr/src/app/" + req.file.path);
      const hexDigest = hashFile(fileBuffer);
      console.log("hex: " + hexDigest);
      Post.findOne({ hash: hexDigest })
        .then((res) => {
          console.log("res: " + res);
          if (res) {
            console.log("hit hit! there was a match");
            console.log("shortid: " + res.shortId);
            return response.send(res.shortId);
          } else {
            console.log("ummm db didnt find so making a new post");
            console.log(res);
            Post.create({
              isImage: true,
              image: req.file.path,
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

router.post("/", async (req, response) => {
  if (!req.body.value) return;
  try {
    console.log("yeah.. text confirmed");
    const hexDigest = hashFile(req.body.value);
    Post.findOne({ hash: hexDigest })
      .then((res) => {
        console.log("res: " + res);
        if (res) {
          console.log("hit hit! there was a match");
          console.log("shortid: " + res.shortId);
          return response.status(200).json({"shortId": res.shortId});
        } else {
          console.log("ummm db didnt find so making a new post");
          Post.create({
            isImage: false,
            value: req.body.value,
            hash: hexDigest,
            language: req.body.language,
          })
            .then((res) => {
              console.log("shortid: " + res.shortId);
              return response.status(200).json({"shortId": res.shortId});
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
});

module.exports = router;
