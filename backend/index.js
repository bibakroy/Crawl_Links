"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 5050;

mongoose.connect(process.env.DATABASE_ACCESS, () =>
  console.log("Database is connected")
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

var routes = require("./route");
routes(app);
// app.use(function (req, res) {
//   res.status(404).send({ url: req.originalUrl + " not found" });
// });
app.listen(port);
console.log("RESTful API server started on: " + port);

module.exports = app;
