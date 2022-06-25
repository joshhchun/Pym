const express = require('express');
const { connections } = require('mongoose');
const router = express.Router({ mergeParams: true });
const Post = require('../models/Post')


router.get("/", (req, res) => {
    const body = `welcome to pym!
  a simple pastebin that supports syntax highlighting.
  
  
  use the commands in the bottom right to create and save
  a new file`;
    res.render("display", { body, language: "plaintext" });
  });
  
router.get("/newpost", (req, res) => {
    res.render("newpost");
});

router.get("/:id", async (req, res) => {
try {
    const post = await Post.findOne({ shortId: req.params.id });
    if (post.isImage) {
      console.log("image: " + post.image);
      res.status(200).json({ isImage: post.isImage, value: post.image });
    }
    else {
      console.log("text: " + post.value + " language: " + post.language);
      res.status(200).json({ isImage: post.isImage, value: post.value, language: post.language });
    }
    // res.render("display", { body: post.value });
} catch (e) {
    const body = `No post with that ID!`;
    res.render("display", { body, language: "plaintext" });
}
});

module.exports = router