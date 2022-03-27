var momentTimezone = require("moment-timezone");

class errorModel {
    constructor(errorMessage, errorCode, errorDescription) {
        this.ErrorCode = errorCode;
        this.ErrorMessage = `Error! ${errorMessage}`;
        this.ErrorDescription = errorDescription;
    }
}

class customerSignUpRequest {
    constructor(req) {
        this.name = req.body.Name ? req.body.Name : "";
        this.phone = req.body.Phone ? req.body.Phone : "";
        this.email = req.body.Email ? req.body.Email : "";
        this.password = req.body.Password ? req.body.Password : "";
        this.imgUrl = req.body.ImgUrl ? req.body.ImgUrl : "";
        this.currentTimestamp = momentTimezone
            .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss ");
    }
}

class customerSignUpResponse {
    constructor() {
        this.Details = {
            CustomerRef: null,
        };
        (this.Error = null);
    }
}

class customerSignInRequest {
    constructor(req) {
        this.email = req.body.Email ? req.body.Email : "";
        this.password = req.body.Password ? req.body.Password : "";
        this.currentTimestamp = momentTimezone
            .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss ");
    }
}

class customerSignInResponse {
    constructor() {
        this.Details = {
            CustomerRef: null,
            Name: null,
            Phone: null,
            ImageUrl: null,
            WalletAmount: null,
        };
        (this.Error = null);
    }
}

class addShowRequest {
    constructor(req) {
        this.name = req.body.Name ? req.body.Name : "";
        this.genre = req.body.Genre ? req.body.Genre : "";
        this.Date = req.body.Date ? req.body.Date : "";
    }
}

class addShowResponse {
    constructor() {
        this.Details = {
            ShowRef: null,
        };
        (this.Error = null);
    }
}

class getShowRequest {
    constructor(req) {
        this.name = req.body.Name ? req.body.Name : null;
        this.genre = req.body.Genre ? req.body.Genre : null;
        this.Date = req.body.Date ? req.body.Date : null;
    }
}

class getShowResponse {
    constructor() {
        this.Details = [];
        (this.Error = null);
    }
}

class addMoneyToWalletRequest {
    constructor(req) {
        this.userRef = req.body.UserRef ? req.body.UserRef : null;
        this.price = req.body.Price ? req.body.Price : null;
    }
}

class addMoneyToWalletResponse {
    constructor() {
        this.Details = {
            prevoiusAmount: null,
            newAmount: null,
        };
        (this.Error = null);
    }
}

class bookticketsRequest {
    constructor(req) {
        this.userRef = req.body.UserRef ? req.body.UserRef : null;
        this.bookingData = req.body.BookingData ? req.body.BookingData : null;
        this.currentTimestamp = momentTimezone
            .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss ");
    }
}


module.exports.ErrorModel = errorModel;
module.exports.CustomerSignUpRequest = customerSignUpRequest;
module.exports.CustomerSignUpResponse = customerSignUpResponse;
module.exports.CustomerSignInRequest = customerSignInRequest;
module.exports.CustomerSignInResponse = customerSignInResponse;
module.exports.AddShowRequest = addShowRequest;
module.exports.AddShowResponse = addShowResponse;
module.exports.GetShowRequest = getShowRequest;
module.exports.GetShowResponse = getShowResponse;
module.exports.AddMoneyToWalletRequest = addMoneyToWalletRequest;
module.exports.AddMoneyToWalletResponse = addMoneyToWalletResponse;
module.exports.BookticketsRequest = bookticketsRequest;