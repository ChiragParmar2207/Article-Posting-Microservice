const User = require('./userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('../Utils/catchAsync')

// ==================== Token Generate ====================
const tokenGenerate = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	})
}

// ==================== REGISTER USER ====================
const signUp = catchAsync(async (req, res) => {
	const user = await User.create(req.body)
	user.password = undefined

	return res.status(201).json({
		message: 'User Register Successfully.',
	})
})

// ==================== LOGIN USER ====================
const signIn = catchAsync(async (req, res) => {
	const { userName, password } = req.body

	const user = await User.findOne({ userName }).select('+password')
	if (
		user === null ||
		!(await user.correctPassword(password, user.password))
	) {
		return res.status(401).json({
			message:
				'UserName or Password incorrect. Check your Login credentials.',
		})
	}

	const token = tokenGenerate(user._id)

	return res.status(200).json({
		message: 'Login Successfully.',
		token,
	})
})

// ==================== USER Exists ====================
const userExist = catchAsync(async (req, res) => {
	const { decoded } = req.body
	const exists = await User.findById(decoded.id)

	if (!exists) {
		return res.status(401).json({
			status: 'Fail',
			message: `User Doesn't exists`,
		})
	}

	if (exists.changedPasswordAfter(decoded.iat)) {
		return res.status(401).json({
			status: 'Fail',
			message: 'User recently changed password! Please log in again.',
		})
	}

	return res.status(200).json({
		status: 'Success',
		message: `User exists`,
	})
})

module.exports = {
	signUp,
	signIn,
	userExist,
}
