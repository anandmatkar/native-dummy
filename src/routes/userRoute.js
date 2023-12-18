const express = require("express")
const { controller } = require("../controllers/indexController")
const { verifyUser } = require("../../utils/jwt")
const router = express.Router()

router.post('/createUser', controller.userController.createUser)
router.post('/loginUser', controller.userController.loginUser)
router.get('/showProfile', verifyUser, controller.userController.showProfile)

module.exports = router