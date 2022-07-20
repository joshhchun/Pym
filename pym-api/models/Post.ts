import mongoose, { Schema, Document } from "mongoose";
import { nanoid } from "nanoid";

export interface IPost extends Document {
  shortId: string;
  group: string;
  value: string;
  hash: string;
  language: string | null;
  expireAt: Date;
}

const postScheme = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        default: () => nanoid(4),
        index: { unique: true },
    },
    group: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: false
    },
    expireAt: {
        type: Date,
        required: true
    }
});

postScheme.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const Post = mongoose.model<IPost>("Post", postScheme);
export { Post }
