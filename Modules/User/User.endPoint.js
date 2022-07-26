const { Roles } = require("../../middelwares/auth");

exports.endPoints = {
    Update_profile : [Roles.User],
    delete_User:[Roles.Admin , Roles.User],
}


