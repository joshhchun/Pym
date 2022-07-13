const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/Post");

// Function to update the expiration time
function updateExpire() {
  var date = new Date(); // Now
  date.setDate(date.getDate() + 15); // Set now + 15 days as the new date
  return date;
}
// API Endpoint to retrieve post data from the database
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ shortId: req.params.id });
    res
      .status(200)
      .json({ value: post.value, group: post.group, language: post.language });
    post.expireAt = updateExpire();
    await post.save();
  } catch (e) {
    console.log("No Post with that ID!");
    res.json(null)
  }
});

module.exports = router;
