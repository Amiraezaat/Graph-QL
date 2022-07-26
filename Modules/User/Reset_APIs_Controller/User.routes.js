const { confirmEmail } = require("./userReset_controller")

const router = require("express").Router()



router.get("/confirm/:token" , confirmEmail)







module.exports = router