const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/Post");

// API Endpoint to retrieve post data from the database
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ shortId: req.params.id });
    console.log(post)
    res
      .status(200)
      .json({value: post.value, group: post.group, language: post.language});
  } catch (e) {
    console.log("No Post with that ID!");
    res.json(null)
  }
});

module.exports = router;
