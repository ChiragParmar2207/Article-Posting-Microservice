const Followers = require('./followersModel')
const User = require('../User/userModel')
const AppError = require('../Utils/appError')
const catchAsync = require('../Utils/catchAsync')
const { isMongoId } = require('validator')

// ==================== FOLLOW ====================
const createFollow = catchAsync(async (req, res, next) => {
	// Users cannot follow themselves
	if (JSON.stringify(req.body.followId) === JSON.stringify(req.user._id)) {
		return next(new AppError('You cannot follow yourself.', 400))
	}

	const userexists = await User.findById(req.body.followId)

	if (!userexists) {
		return next(
			new AppError('User does not exists which you want to follow.', 404)
		)
	}

	const data = await Followers.findOne({
		userId: req.user._id,
		followId: req.body.followId,
	})

	if (data) {
		return next(new AppError('You are already follow This user.', 400))
	}

	await Followers.create({
		userId: req.user._id,
		followId: req.body.followId,
	})

	res.status(200).json({
		message: 'Follow successfully.',
	})
})

// ==================== GET ALL FOLLOWERS ====================
const getAllFollowers = catchAsync(async (req, res, next) => {
	const followers = await Followers.find({ userId: req.user._id }).populate(
		'followId'
	)

	res.status(200).json(followers)
})

// ==================== GET ALL FOLLOWING ====================
const getAllFollowing = catchAsync(async (req, res, next) => {
	const following = await Followers.find({ followId: req.user._id }).populate(
		'userId'
	)

	res.status(200).json(following)
})

// ==================== UNFOLLOW ====================
const unfollow = catchAsync(async (req, res, next) => {
	if (!isMongoId(req.params.followId))
		return next(new AppError('Provide valid Follow Id.', 400))

	const userexists = await User.findById(req.params.followId)

	if (!userexists) {
		return next(
			new AppError(
				'User does not exists which you want to unfollow.',
				404
			)
		)
	}

	const data = await Followers.findOne({
		followId: req.params.followId,
		userId: req.user._id,
	})

	if (!data) {
		return next(new AppError('You do not follow this user.', 400))
	}

	await Followers.findByIdAndDelete(data._id)

	res.status(200).json({
		message: 'Unfollow successfully.',
	})
})

module.exports = {
	createFollow,
	getAllFollowers,
	getAllFollowing,
	unfollow,
}
