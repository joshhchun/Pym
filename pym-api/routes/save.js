const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const mimeTypes = ["image/jpeg", "image/png", "image/heic", "text/plain"];
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
router.post("/", upload.single("files"), async (req, response) => {
    try {
        // Hashing the file to see if post already exists in the database
        const fileBuffer = req.file ? fs.readFileSync("/usr/src/app/" + req.file.path) : req.body.value;
        const hexDigest = hashFile(fileBuffer);
        Post.findOne({ hash: hexDigest })
            .then((res) => {
                // There was a post in the database with same hash so delete newly added file and return existing URL
                if (res) {
                    if (req.file) {
                        fs.unlink("/usr/src/app/" + req.file.path, (err) => {
                            if (err) console.log(err);
                        })
                    }
                    return response.status(200).json({ shortId: res.shortId });
                    // There was no existing post with same hash so making new DB entry
                } else {
                    Post.create({
                        group: req.file ? "image" : req.body.group,
                        value: req.file ? req.file.path : req.body.value,
                        hash: hexDigest,
                        language: req.body.language,
                    })
                        .then((res) => {
                            return response.status(200).json({ shortId: res.shortId });
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
