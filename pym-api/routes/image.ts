import express, { Request, Response } from "express";
const router = express.Router({ mergeParams: true });
import fs from "fs";
import { Post } from "../models/Post";

var options = {
  dotfiles: "deny",
};
// API Endpoint to retrieve post data from the database
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findOne({ shortId: req.params.id });
    console.log(post);
    if (post) {
      if (!post.value.includes(process.env.FORBIDDEN!)) {
        if (post.group === "image") {
          res.sendFile(
            process.env.URL + post.value,
            options,
            function (err: any) {
              if (err) {
                console.log(err);
                return res.send(null);
              }
            }
          );
        } else {
          return res.send("Only raw images are allowed :-)");
        }
      } else {
        return res.send("tsk tsk tsk, IP Grabbed :-)");
      }
    } else {
      return res.send("No post with that ID!");
    }
  } catch (e: any) {
    console.log("error " + e);
    return res.send(null);
  }
});

export { router as imageRouter };
