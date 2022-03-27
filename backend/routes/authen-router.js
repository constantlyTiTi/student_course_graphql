const express = require('express')

const authenCtrl = require('../controllers/authentication-ctrl')

const router = express.Router()

router.post('/signup', authenCtrl.signUp)
router.post('/login', authenCtrl.login)

module.exports = router