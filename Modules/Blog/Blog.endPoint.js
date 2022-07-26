const { Roles } = require("../../middelwares/auth");
 



exports.endPoints  = {
    Add_Blog :[ Roles.User ,Roles.Admin],
    Update_blog : [Roles.User],
    delete_Blog:[ Roles.User ,Roles.Admin]
}