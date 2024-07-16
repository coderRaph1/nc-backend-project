const express = require("express");
const app = express();
const {getTopicsController} = require("./controllers/get-topics-controller");
const {getApiController} = require("./controllers/get-api-controller")

app.get("/api", getApiController);

app.get("/api/topics", getTopicsController);

module.exports = app;
