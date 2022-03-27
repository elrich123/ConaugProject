var coreRequestModel = require("../models/coreServiceModel");
const uri = "mongodb+srv://elrich_conaug:lVUNRs1V2pBRB4Er@cluster0.idcyp.mongodb.net/elrich?retryWrites=true&w=majority";
var constant = require("../common/constant");
const mongo = require("mongodb").MongoClient;
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
var databaseHelper = require("../helper/general");

module.exports.CustomerSignUp = async (req, res) => {

    const functionContext = {
        error: null,
        res: res,
      };

    var CustomerSignUpRequest = new coreRequestModel.CustomerSignUpRequest(
      req
    );

    var salt = await bcrypt.genSalt(10)
    var encryptedPassword = await bcrypt.hash(CustomerSignUpRequest.password, salt);

    try {
        var item = {
            UserRef: uuidv4(),
            Name: CustomerSignUpRequest.name,
            Phone: CustomerSignUpRequest.phone,
            Email: CustomerSignUpRequest.email,
            Password: encryptedPassword,
            WalletAmount: 0,
            CreatedOn: CustomerSignUpRequest.currentTimestamp
        }

        mongo.connect(uri, function (err, client) {
            var db = client.db("elrich");
            db.collection("users").insertOne(item, function (err, result) {
            console.log("item inserted");
            client.close();
            });
        });


      CustomerSignUpResponse(functionContext, item);
    } catch (errIsCustomerPresent) {
      if (!errIsCustomerPresent.ErrorMessage && !errIsCustomerPresent.ErrorCode) {
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
  
      CustomerSignUpResponse(functionContext, null);
    }
  };

  var CustomerSignUpResponse = (functionContext, resolvedResult) => {
    
    var CustomerSignUpResponse = new coreRequestModel.CustomerSignUpResponse();
  
    if (functionContext.error) {
        CustomerSignUpResponse.Error = functionContext.error;
        CustomerSignUpResponse.Details = null;
    } else {
        CustomerSignUpResponse.Error = null;
        CustomerSignUpResponse.Details.CustomerRef = resolvedResult.UserRef;
    }
    databaseHelper.SendHttpResponse(functionContext, CustomerSignUpResponse);
  };

  module.exports.CustomerSignIn = async (req, res) => {

    const functionContext = {
        error: null,
        res: res,
      };

    var CustomerSignInRequest = new coreRequestModel.CustomerSignInRequest(
      req
    );

    try {
        async function main() {
            let client, db;
            client = await mongo.connect(uri, {
              useNewUrlParser: true,
            });
            db = client.db("elrich");
            let dCollection = db.collection("users");
            let result = await dCollection.find({
                Email: CustomerSignInRequest.email,
            });
            return result.toArray();
            client.close();
          }

          main()
          .then((result) => {
            if(result.length == 0){
                errorCode = constant.ErrorCode.Invalid_Authentication;
                errorMessage = constant.ErrorMessage.Invalid_Authentication;

                functionContext.error = new coreRequestModel.ErrorModel(
                    errorMessage,
                    errorCode
                  );
                  CustomerSignInResponse(functionContext);
            }else{
                var typedPassword = CustomerSignInRequest.password;
                var comparePwd = bcrypt.compareSync(typedPassword, result[0].Password)
                if(comparePwd){
                    CustomerSignInResponse(functionContext, result[0]);
                }else{
                errorCode = constant.ErrorCode.Invalid_Password;
                errorMessage = constant.ErrorMessage.Invalid_Password;

                functionContext.error = new coreRequestModel.ErrorModel(
                    errorMessage,
                    errorCode
                  );
                  CustomerSignInResponse(functionContext);
                }
            }
            })
    } catch (errIsCustomerPresent) {
      if (!errIsCustomerPresent.ErrorMessage && !errIsCustomerPresent.ErrorCode) {
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
  
      CustomerSignInResponse(functionContext, null);
    }
  };

  var CustomerSignInResponse = (functionContext, resolvedResult) => {
    
    var CustomerSignInResponse = new coreRequestModel.CustomerSignInResponse();
  
    if (functionContext.error) {
        CustomerSignInResponse.Error = functionContext.error;
        CustomerSignInResponse.Details = null;
    } else {
        CustomerSignInResponse.Error = null;
        CustomerSignInResponse.Details.CustomerRef = resolvedResult.UserRef;
        CustomerSignInResponse.Details.Name = resolvedResult.Name;
        CustomerSignInResponse.Details.Phone = resolvedResult.Phone;
        CustomerSignInResponse.Details.ImageUrl = resolvedResult.ImageUrl;
        CustomerSignInResponse.Details.WalletAmount = resolvedResult.WalletAmount;
    }
    databaseHelper.SendHttpResponse(functionContext, CustomerSignInResponse);
  };

  module.exports.AddMoneyToWallet = async (req, res) => {

    const functionContext = {
        error: null,
        res: res,
      };

    var addMoneyToWalletRequest = new coreRequestModel.AddMoneyToWalletRequest(
      req
    );

    try {
        async function main() {
            let client, db;
            client = await mongo.connect(uri, {
              useNewUrlParser: true,
            });
            db = client.db("elrich");
            let dCollection = db.collection("users");
            let result = await dCollection.find({
                UserRef: addMoneyToWalletRequest.userRef,
            });
            return result.toArray();
            client.close();
          }

          main()
          .then((result) => {
            console.log(result);

            if (result[0].WalletAmount + addMoneyToWalletRequest.price >= 100) {
                var total = result[0].WalletAmount + addMoneyToWalletRequest.price
                mongo.connect(uri, function (err, client) {
                    var db = client.db("elrich");
                    db.collection("users").updateOne({_id: result[0]._id},
                        { $set : { WalletAmount: total } }, 
                        function (err, result) {
                    console.log("item inserted");
                    client.close();
                    });
                });
                AddMoneyToWalletResponse(functionContext, result[0].WalletAmount, addMoneyToWalletRequest.price)
            }else{
                errorCode = constant.ErrorCode.Invalid_Amount;
                errorMessage = constant.ErrorMessage.Invalid_Amount;

                functionContext.error = new coreRequestModel.ErrorModel(
                    errorMessage,
                    errorCode
                  );
                  AddMoneyToWalletResponse(functionContext);
            }

        })
    } catch (errIsCustomerPresent) {
      if (!errIsCustomerPresent.ErrorMessage && !errIsCustomerPresent.ErrorCode) {
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
  
      AddMoneyToWalletResponse(functionContext, null);
    }
  };

  var AddMoneyToWalletResponse = (functionContext, prevAmount, newAmount) => {
    
    var AddMoneyToWalletResponse = new coreRequestModel.AddMoneyToWalletResponse();
  
    if (functionContext.error) {
        AddMoneyToWalletResponse.Error = functionContext.error;
        AddMoneyToWalletResponse.Details = null;
    } else {
        AddMoneyToWalletResponse.Error = null;
        AddMoneyToWalletResponse.Details.prevoiusAmount = prevAmount;
        AddMoneyToWalletResponse.Details.newAmount = prevAmount + newAmount;
    }
    databaseHelper.SendHttpResponse(functionContext, AddMoneyToWalletResponse);
  };

  module.exports.Booktickets = async (req, res) => {

    const functionContext = {
        error: null,
        res: res,
        WalletAmount: 0,
        userDets: [],
      };

    var bookticketsRequest = new coreRequestModel.BookticketsRequest(
      req
    );

    let ShowRefs = bookticketsRequest.bookingData.map(items => items.ShowRef);

    try {
        async function userDetails() {
        let client, db;
        client = await mongo.connect(uri, {
          useNewUrlParser: true,
        });
        db = client.db("elrich");
        let dCollection = db.collection("users");
        let result = await dCollection.find({
            UserRef: bookticketsRequest.userRef,
        });
        return result.toArray();
        client.close();
      }
      userDetails()
          .then((result) => {
            console.log(result);
            functionContext.userDets.push(result);
            functionContext.WalletAmount = result[0].WalletAmount;
          });
        
        async function main() {
            let client, db;
            client = await mongo.connect(uri, {
              useNewUrlParser: true,
            });
            db = client.db("elrich");
            let dCollection = db.collection("shows");
            let result = await dCollection.find({
                "ShowRef": {"$in" : ShowRefs }
            });
            return result.toArray();
            client.close();
          }

          main()
          .then((result) => {
            console.log(result);
            var totalPrice = 0;
            
            for (let index = 0; index < result.length; result++) {
                var showsArray = bookticketsRequest.bookingData.filter(item => item.ShowRef == result[index].ShowRef)                
            }
            console.log(functionContext.userDets,"check");
            totalPrice = showsArray[0].TicketQuantity * functionContext.userDets[0].Price
            // console.log(totalPrice, "check price");

          });

      CustomerSignUpResponse(functionContext, item);
    } catch (errIsCustomerPresent) {
      if (!errIsCustomerPresent.ErrorMessage && !errIsCustomerPresent.ErrorCode) {
        functionContext.error = new coreRequestModel.ErrorModel(
          constant.ErrorMessage.ApplicationError,
          constant.ErrorCode.ApplicationError
        );
      }
  
      CustomerSignUpResponse(functionContext, null);
    }
  };