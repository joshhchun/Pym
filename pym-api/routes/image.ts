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
      if (post.group === "image") {
        if (post.value.includes(process.env.FORBIDDEN!)) return res.send("tsk tsk tsk tsk");
        res.sendFile(process.env.URL + post.value, options, function (err: any) {
          if (err) {
            console.log(err);
            res.send(null);
          }
        });
      } else {
        return res.send("tsk tsk tsk tsk");
      }
  }
  } catch (e: any) {
    console.log("No Post with that ID!" + e);
    res.send(null);
  }
});

export { router as imageRouter };
