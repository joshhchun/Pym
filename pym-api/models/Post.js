const mongoose = require("mongoose");
const nanoid = require("nanoid");

const postScheme = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    default: () => nanoid(4),
    index: { unique: true },
  },
  value: {
    type: String,
    required: false,
  },
  isImage: {
    type: Boolean,
    required: true,
    default: false,
  },
  hash: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Post", postScheme);
