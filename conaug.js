var express = require("express");
var app = express();
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));

console.log("here");
startServerProcess();

var customerRoute = require("./routes/customerRoutes");
app.use("/api/customer", customerRoute);

var showRoute = require("./routes/showRoutes");
app.use("/api/show", showRoute);

async function startServerProcess() {
    console.log("here");
    try {
      console.log('StartServerProcess Invoked()');
      app.listen('3000', () => {
        console.log("server running on port " + 3000);
      });
    } catch (errFetchDBSettings) {
        console.log(
        "Error occured in starting node services. Need immediate check."
      );
    }
  }


