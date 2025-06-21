const express = require('express')
const { signUp, signIn, userExist } = require('./userController')
const router = express.Router()
const { signupMiddleware, signinMiddleware } = require('./userMiddleware')

router.route('/signup').post(signupMiddleware, signUp)

router.route('/signin').post(signinMiddleware, signIn)

router.route('/userExists').post(userExist)

module.exports = router
