module.exports.ErrorCode = {
    ApplicationError: 500,
    Success: 200,
    Invalid_Authentication: 10001,
    Invalid_Password: 10002,
    Invalid_Amount: 10003,
}

module.exports.ErrorMessage = {
    ApplicationError: "An Application Error Has Occured",
    Invalid_Authentication: "No matching records.",
    Invalid_Password: "Invalid_Password",
    Invalid_Amount: "Amount has to be 100 minimum",
}