const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		topicName: {
			type: String,
			required: [true, 'Topic name is required.'],
			unique: true,
		},
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: 'user',
			required: [true, 'User id is required.'],
		},
	},
	{
		timestamps: true,
	}
)

const topicSchema = mongoose.model('topic', schema)

module.exports = topicSchema
