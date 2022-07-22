import express, { Request, Response } from "express";
const router = express.Router({ mergeParams: true });
import fs from "fs";
import { Post } from "../models/Post"; 

var options = {
  dotfiles: 'deny'
}
// API Endpoint to retrieve post data from the database
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ shortId: req.params.id });
    if (post) {
      if (post.group === "image" && !post.value.includes(process.env.FORBIDDEN!)) {
        res.sendFile(process.env.URL + post.value, options, function (err: any) {
          if (err) {
            console.log(err);
            res.send(null);
          }
        });
      } else {
        return res.send("tsk tsk tsk tsk");
      }
  } else {
    return res.send("No post with that ID!");
  }
  } catch (e: any) {
    console.log("No Post with that ID!" + e);
    res.send(null);
  }
});

export { router as imageRouter };
