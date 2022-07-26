const { UserInputError } = require("apollo-server-express")


// ========= handle the error of validation ==========
exports.validation_error= (error)=>{
    throw new UserInputError('validation Error', { error })
}
 
// ========= handle the error of authorization ========
exports.access_deined = (error)=>{
    if(!error || error == null || error == undefined ){
        error = ''
    }
    throw new UserInputError('Access Denied', { error })
}
