const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/Post");
const fs = require("fs");

var options = {
  dotfiles: 'deny'
}
// API Endpoint to retrieve post data from the database
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ shortId: req.params.id });
    if (post.group === "image") {
	if (post.value.includes(process.env.FORBIDDEN)) return res.send("tsk tsk tsk tsk");
    	res.sendFile(process.env.URL + post.value, options, function (err) {
	  if (err) {
	    console.log(err);
	    res.send(null);
	  }
	});
     } else {
	res.send("tsk tsk tsk tsk");
     }
  } catch (e) {
    console.log(e);
    console.log("No Post with that ID!");
    res.json(null)
  }
});

module.exports = router;
