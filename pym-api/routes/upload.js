const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");
const mimeTypes = ["image/jpeg", "image/png", "text/plain"];

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
const fileFilter = (req, res, cb) => {
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

module.exports = router