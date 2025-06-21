const express = require('express')
const router = express.Router()
const { protect } = require('../Utils/authMiddleware')
const {
	createFollow,
	getAllFollowers,
	getAllFollowing,
	unfollow,
} = require('./followersController')

router.use(protect)

router.route('/follow').post(createFollow)

router.route('/unfollow/:followId').delete(unfollow)

router.route('/getFollowers').get(getAllFollowers)

router.route('/getFollowing').get(getAllFollowing)

module.exports = router
