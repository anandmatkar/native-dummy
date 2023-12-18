const epxress = require("express")
const route = epxress.Router();

route.use('/user', require("./userRoute"))

module.exports = route