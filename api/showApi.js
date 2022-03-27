var coreRequestModel = require("../models/coreServiceModel");
const uri = "mongodb+srv://elrich_conaug:lVUNRs1V2pBRB4Er@cluster0.idcyp.mongodb.net/elrich?retryWrites=true&w=majority";
var constant = require("../common/constant");
const mongo = require("mongodb").MongoClient;
const { v4: uuidv4 } = require('uuid');
var databaseHelper = require("../helper/general");

module.exports.AddShow = async (req, res) => {

    const functionContext = {
        error: null,
        res: res,
      };

    var addShowRequest = new coreRequestModel.AddShowRequest(
      req
    );

    try {
        var item = {
            ShowRef: uuidv4(),
            Name: addShowRequest.name,
            Time: addShowRequest.time,
            Genre: addShowRequest.genre,
            Date: addShowRequest.Date,
            Price: addShowRequest.price,
            CreatedOn: addShowRequest.currentTimestamp
        }

        mongo.connect(uri, function (err, client) {
            var db = client.db("elrich");
            db.collection("shows").insertOne(item, function (err, result) {
            console.log("item inserted");
            client.close();
            });
        });


        addShowResponse(functionContext, item);
    } catch (errIsCustomerPresent) {
      if (!errIsCustomerPresent.ErrorMessage && !errIsCustomerPresent.ErrorCode) {
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
  
      addShowResponse(functionContext, null);
    }
  };

  var addShowResponse = (functionContext, resolvedResult) => {
    
    var addShowResponse = new coreRequestModel.AddShowResponse();
  
    if (functionContext.error) {
        addShowResponse.Error = functionContext.error;
        addShowResponse.Details = null;
    } else {
        addShowResponse.Error = null;
        addShowResponse.Details.ShowRef = resolvedResult.ShowRef;
    }
    databaseHelper.SendHttpResponse(functionContext, addShowResponse);
  };

  module.exports.GetAllShows = async (req, res) => {

    const functionContext = {
        error: null,
        res: res,
      };

    var getShowRequest = new coreRequestModel.GetShowRequest(
      req
    );

    var filter = {};

    if(getShowRequest.name){
        filter.Name = getShowRequest.name;
    }
    if(getShowRequest.Date){
        filter.Date = getShowRequest.Date;
    }if(getShowRequest.genre){
        filter.Genre = getShowRequest.genre;
    }


    try {
        async function main() {
            let client, db;
            client = await mongo.connect(uri, {
              useNewUrlParser: true,
            });
            db = client.db("elrich");
            let dCollection = db.collection("shows");
            let result = await dCollection.find(filter);
            return result.toArray();
            client.close();
          }
          main()
          .then((result) => {
            console.log(result);
            getShowsResponse(functionContext, result);
          })

    } catch (errIsCustomerPresent) {
      if (!errIsCustomerPresent.ErrorMessage && !errIsCustomerPresent.ErrorCode) {
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
  
      getShowsResponse(functionContext, null);
    }
  };

  var getShowsResponse = (functionContext, resolvedResult) => {
    
    var getShowsResponse = new coreRequestModel.GetShowResponse();
  
    if (functionContext.error) {
        getShowsResponse.Error = functionContext.error;
        getShowsResponse.Details = null;
    } else {
        getShowsResponse.Error = null;
        for (let index = 0; index < resolvedResult.length; index++) {
            getShowsResponse.Details.push({
                ShowRef: resolvedResult[index].ShowRef,
                Name: resolvedResult[index].Name,
                Time: resolvedResult[index].Time,
                Genre: resolvedResult[index].Genre,
                Price: resolvedResult[index].Price,
                Date: resolvedResult[index].Date,
            })
            
        }
        
    }
    databaseHelper.SendHttpResponse(functionContext, getShowsResponse);
  };