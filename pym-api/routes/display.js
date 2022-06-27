const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/Post");

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ shortId: req.params.id });
    console.log(post)
    res
      .status(200)
      .json({value: post.value, isImage: post.isImage, language: post.language});
  } catch (e) {
    console.log("No Post with that ID!");
    res.json(null)
  }
});

module.exports = router;
