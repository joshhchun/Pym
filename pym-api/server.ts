import express from "express";
const dotenv = require("dotenv").config();
import cors from "cors";
const app = express();

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

import { saveRouter } from "./routes/save";
import { displayRouter } from "./routes/display";
import { imageRouter } from "./routes/image";

// Init MongoDB
require("./utils/initDB")();

app.use('/api/display', displayRouter);
app.use('/api', imageRouter);
app.use('/api/save', saveRouter);

// Listen on Port 5000
app.listen(5000);
