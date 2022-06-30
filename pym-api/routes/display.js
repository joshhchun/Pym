const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/Post");

// Function to update the expiration time
const updateExpire = () => {
    var date = new Date(); // Now
    date.setDate(date.getDate() + 15); // Set now + 15 days as the new date
    return date;
}
// API Endpoint to retrieve post data from the database
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ shortId: req.params.id });
        console.log(post)
        res
            .status(200)
            .json({ value: post.value, group: post.group, language: post.language });
        // If a user visits a post, reset its expiration date
        Post.findOneAndUpdate({ shortId: req.params.id }, { expireAt: updateExpire() }, (err, docs) => {
            if (err) console.log(err);
        })
    } catch (e) {
        console.log("No Post with that ID!");
        res.json(null)
    }
});

module.exports = router;
