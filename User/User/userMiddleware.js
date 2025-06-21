const AppError = require('../Utils/appError')

const signupMiddleware = async (req, res, next) => {
	const missingValues = []
	if (!req.body.name) missingValues.push('Provide Name')
	if (!req.body.userName) missingValues.push('Provide User Name')
	if (!req.body.email) missingValues.push('Provide Email')
	if (!req.body.phone) missingValues.push('Provide Phone Number')
	if (!req.body.password) missingValues.push('Provide Password')
	if (!req.body.passwordConfirm)
		missingValues.push('Provide Password Confirm')

	if (missingValues.length > 0)
		return next(
			new AppError(`requird missing values : ${missingValues}`, 400)
		)

	if (req.body.password !== req.body.passwordConfirm) {
		return next(
			new AppError('Password and Password Confirm are not match', 400)
		)
	}

	const emailRegex =
		/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
	if (!emailRegex.test(req.body.email)) {
		return next(new AppError('Enter valid Email Address', 400))
	}

	if ('number' !== typeof req.body.phone) {
		return next(new AppError('Phone Number is Must be a number', 400))
	}

	const phoneRegex = /^[9876]+[0-9]{9}$/
	if (!phoneRegex.test(req.body.phone)) {
		return next(
			new AppError(
				'Enter valid Phone number. Mobile number always start with 6, 7, 8 and 9 and must be a 10 digit',
				400
			)
		)
	}

	next()
}

const signinMiddleware = async (req, res, next) => {
	const missingValue = []
	if (!req.body.userName) missingValue.push('Provide User Name')
	if (!req.body.password) missingValue.push('Provide password')

	if (missingValue.length > 0)
		return next(
			new AppError(`requird missing values: ${missingValue}`, 400)
		)

	next()
}

module.exports = {
	signinMiddleware,
	signupMiddleware,
}
