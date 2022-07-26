
const mongoose  = require("mongoose")

const connectionDB  = ()=>{
    return mongoose.connect(process.env.DBONLINE_URL)
    .then((res)=> console.log("DB connected Done"))
    .catch((err)=> console.log("DB connected Fail"))
}

module.exports = connectionDB
