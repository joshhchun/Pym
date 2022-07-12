import dbConnect from "../../utils/initDB";
import Post from "../../models/Post";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";

const mimeTypes = ["image/jpeg", "image/png", "image/heic"];
const textMimeTypes = {
    "text/plain": "plaintext",
    "text/x-c": "c",
    "text/x-python": "python",
    "text/x-python-script": "python",
    "text/javascript": "javascript",
};

/* Multer (file upload) configuration */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    // Custom file name
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// File filtering
const fileFilter = (req, file, cb) => {
    // If the submitted file mime type is accepted
    console.log(file.mimetype);
    if (mimeTypes.includes(file.mimetype) || file.mimetype in textMimeTypes) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        // 5 mb
        fileSize: 5242880,
    },
    fileFilter: fileFilter,
});
/**************************************/

// Function to find the SHA256 hash of the file
const hashFile = (content) => {
    const hashSum = crypto.createHash("sha256");
    hashSum.update(content);
    return hashSum.digest("hex");
};

// Function to update the expiration time
function updateExpire() {
    var date = new Date(); // Now
    date.setDate(date.getDate() + 15); // Set now + 15 days as the new date
    return date;
}

// Function to handle if the user uploads a file
async function handleFile(hexDigest, file, response) {
    // If the file is a text (or code file) then treat it as a text post
    let fileBuffer = "";
    if (file.mimetype in textMimeTypes) {
        fileBuffer = fs.readFileSync("/usr/src/app/" + file.path).toString();
    }
    Post.create({
        expireAt: updateExpire(),
        group: fileBuffer ? "text" : "image",
        value: fileBuffer ? fileBuffer : file.path,
        hash: hexDigest,
        language: textMimeTypes[file.mimetype],
    })
        .then((res) => {
            console.log(res);
            return response.status(200).json({ shortId: res.shortId });
        })
        .catch((e) => {
            console.log("error: " + e);
        });
}

// Function to handle if user pastes text
async function handleText(hexDigest, body, response) {
    Post.create({
        expireAt: updateExpire(),
        group: body.group,
        value: body.value,
        hash: hexDigest,
        language: body.language,
    })
        .then((res) => {
            return response.status(200).json({ shortId: res.shortId });
        })
        .catch((e) => {
            console.log("error: " + e);
        });
}
// API Endpoint for uploading an image
export default async function handler(req, res)("/", upload.single("files"), async (req, response) => {
    // Hashing the file to see if post already exists in the database
    const fileBuffer = req.file
        ? fs.readFileSync("/usr/src/app/" + req.file.path)
        : req.body.value;
    const hexDigest = hashFile(fileBuffer);
    const shortId = await checkHash(hexDigest, req.file);
    // If the shortId exists for the hash contents of the file then return it
    if (shortId) {
        return response.status(200).json({ shortId: shortId });
    } else {
        if (req.file) await handleFile(hexDigest, req.file, response);
        else await handleText(hexDigest, req.body, response);
    }
});

module.exports = router;
