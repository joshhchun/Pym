const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
// const redisClient = require("redis").createClient;
// const redis = redisCleint(process.env.REDIS_PORT, process.env.REDIS_URL);

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

// const uploadRouter = require("./routes/upload")
const saveRouter = require("./routes/save");
const displayRouter = require("./routes/display");
const imageRouter = require("./routes/image");

const Post = require("./models/Post");
const mongoose = require("mongoose");
// Init MongoDB
require("./initDB")();

app.use('/api/display', displayRouter);
app.use('/api', imageRouter);
app.use('/api/save', saveRouter);
// app.use('/new', uploadRouter);

// Listen on Port 3000
app.listen(5000);
