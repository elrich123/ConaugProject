var express = require("express");
var router = express.Router();

var customerApi = require("../api/customerApi");

router.post("/signup", customerApi.CustomerSignUp);
router.post("/login", customerApi.CustomerSignIn);
router.post("/addmoneytowallet", customerApi.AddMoneyToWallet);
router.post("/booktickets", customerApi.Booktickets);


module.exports = router;
