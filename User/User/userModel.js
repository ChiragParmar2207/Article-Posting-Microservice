const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const validator = require('validator')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is Required.'],
		},
		userName: {
			type: String,
			required: [true, 'UserName is Required.'],
			unique: true,
		},
		email: {
			type: String,
			unique: true,
			required: [true, 'Email address is Required.'],
			lowercase: true,
			validate: [validator.isEmail, 'Provide a valid email'],
		},
		phone: {
			type: String,
			required: [true, 'Phone number is Required.'],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Password is Required'],
			min: 8,
			max: 20,
			select: false,
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{
		timestamps: true,
	}
)

schema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()

	this.password = await bcryptjs.hash(this.password, 12)

	this.passwordConfirm = undefined

	next()
})

schema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } })
	next()
})

schema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcryptjs.compare(candidatePassword, userPassword)
}

schema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		)
		return JWTTimestamp < changedTimestamp
	}

	return false
}

const userSchema = mongoose.model('user', schema)

module.exports = userSchema
