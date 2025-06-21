const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		comment: {
			type: String,
			required: [true, 'Comment is required.'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, 'Rating is required.'],
		},
		articleId: {
			type: mongoose.Schema.ObjectId,
			ref: 'article',
			required: [true, 'Article Id is required.'],
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

const commentSchema = mongoose.model('comment', schema)

module.exports = commentSchema
