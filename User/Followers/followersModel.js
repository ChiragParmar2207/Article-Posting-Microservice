const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		followId: {
			type: mongoose.Schema.ObjectId,
			ref: 'user',
			required: [true, 'Follower Id is required.'],
		},
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: 'user',
			required: [true, 'Currently logged in User Id is required.'],
		},
	},
	{
		timestamps: true,
	}
)

const followersSchema = mongoose.model('follower', schema)

module.exports = followersSchema
