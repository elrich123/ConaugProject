var express = require("express");
var router = express.Router();

var showApi = require("../api/showApi");

router.post("/addshows", showApi.AddShow);
router.post("/shows", showApi.GetAllShows);


module.exports = router;