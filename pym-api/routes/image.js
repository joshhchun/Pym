const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/Post");
const fs = require("fs");

// API Endpoint to retrieve post data from the database
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ shortId: req.params.id });
    const fileBuffer = fs.readFileSync("/usr/src/app/" + post.value);
    res
      .status(200)
      .send(fileBuffer);
  } catch (e) {
    console.log("No Post with that ID!");
    res.json(null)
  }
});

module.exports = router;
