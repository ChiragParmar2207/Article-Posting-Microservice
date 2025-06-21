const jwt = require('jsonwebtoken')
const AppError = require('./appError')
const catchAsync = require('./catchAsync')
const { isMongoId } = require('validator')
const { isJWT } = require('validator')
const axios = require('axios')

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

	if (!isMongoId(decoded.id))
		return next(new AppError('Something wrong in token', 400))

	const currentTime = Math.floor(Date.now() / 1000)
	if (currentTime > decoded.exp) {
		return res.status(401).json({
			message: 'Token Expired! Login to get access.',
		})
	}

	const exists = await axios.post(
		'http://127.0.0.1:5000/user/api/userroute/userExists',
		{ decoded }
	)

	if (exists.data.status === 'Fail') {
		return res.status(401).json({
			message: 'The user belonging to this token does no longer exist.',
		})
	}

	req.userId = decoded.id

	next()
})

module.exports = {
	protect,
}
