import express from "express";
const router = express.Router({ mergeParams: true });
import { Post } from "../models/Post";

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
    if (post) {
      res
        .status(200)
        .json({ value: post.value, group: post.group, language: post.language });
      post.expireAt = updateExpire();
      await post.save();
    } else {
      return res.json({ value: "Sorry, no post with that ID! :P", group: "text", "language": "plaintext" })
    }
  } catch (e) {
    console.log("No Post with that ID!");
    res.json(null)
  }
});

export { router as displayRouter }

