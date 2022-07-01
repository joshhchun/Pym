const mongoose = require("mongoose");
const nanoid = require("nanoid");

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
        type: Date
    }
});

postScheme.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("Post", postScheme);
