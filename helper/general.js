var multer = require("multer");
var fileConfiguration = require("../common/settings").FileConfiguration;
var constant = require("../common/constant");

exports.getFileUploadConfig = multer({
    storage: multer.diskStorage({
        destination: fileConfiguration.LocalStorage,
        filename: function (req, file, cb) {
            cb(null, new Date().toDateString() + file.originalname);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/bmp"
        ) {
            cb(null, true);
        } else {
            cb(new Error("Invalid File"), false);
        }
    }
});

module.exports.SendHttpResponse = async (functionContext, response) => {
    var logger = functionContext.logger;
  
    let httpResponseType = constant.ErrorCode.Success;
    functionContext.res.writeHead(httpResponseType, {
      "Content-Type": "application/json",
    });
  
    var apiContext = functionContext.res.apiContext;

    functionContext.responseText = JSON.stringify(response);
    functionContext.res.end(functionContext.responseText);
  
  };
  