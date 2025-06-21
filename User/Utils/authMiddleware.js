const jwt = require('jsonwebtoken')
const User = require('../User/userModel')
const AppError = require('./appError')
const catchAsync = require('./catchAsync')
const mongoose = require('mongoose')
const { isJWT } = require('validator')

const protect = catchAsync(async (req, res, next) => {
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1]
	} else if (req.headers.authorization) {
		token = req.headers.authorization.split(' ')[1]
	}

	if (!isJWT(token))
		return next(
			new AppError(
				'Token is not valid use valid token or sign in again',
				401
			)
		)

	if (!token) {
		return next(
			new AppError(
				'You can not logged in. first log in and try again.',
				403
			)
		)
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET)

	const currentUser = await User.findById(
		new mongoose.Types.ObjectId(decoded.id)
	)

	if (!currentUser) {
		return next(
			new AppError(
				'user belonging to this token does no longer exist.',
				401
			)
		)
	}

	req.user = currentUser

	next()
})

module.exports = {
	protect,
}
