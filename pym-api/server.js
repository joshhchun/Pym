const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

// const uploadRouter = require("./routes/upload")
const saveRouter = require("./routes/save");
const displayRouter = require("./routes/display");

const Post = require("./models/Post");
const mongoose = require("mongoose");
// Init MongoDB
require("./initDB")();

app.use('/', displayRouter);
app.use('/save', saveRouter);
// app.use('/new', uploadRouter);

// Listen on Port 3000
app.listen(3001);
