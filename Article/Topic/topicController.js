const Topic = require('./topicModel')
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/appError')

// ==================== CREATE TOPIC ====================
const createTopic = catchAsync(async (req, res, next) => {
	const existsTopic = await Topic.findOne({ topicName: req.body.topicName })

	if (existsTopic) {
		return next(
			new AppError(
				`Topic Name ${req.body.topicName} already exists.`,
				400
			)
		)
	}

	await Topic.create({
		topicName: req.body.topicName,
		userId: req.userId,
	})

	res.status(201).json({
		message: 'Topic Created Successfully.',
	})
})

// ==================== UPDATE TOPIC ====================
const updateTopic = catchAsync(async (req, res, next) => {
	const topic = await Topic.findOne({
		_id: req.params.topicId,
		userId: req.userId,
	})

	if (!topic) {
		return next(
			new AppError(
				`You can not update this topic because You are not the author of this topic.`,
				401
			)
		)
	}

	await Topic.findByIdAndUpdate(
		req.params.topicId,
		{
			topicName: req.body.topicName,
		},
		{ new: true }
	)

	res.status(200).json({
		message: 'Topic Updated Successfully.',
	})
})

// ==================== GET ALL TOPICS ====================
const getAllTopics = catchAsync(async (req, res) => {
	const topics = await Topic.aggregate([
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'user',
			},
		},
		{
			$unwind: '$user',
		},
		{
			$project: {
				_id: {
					id: '$_id',
					topicName: '$topicName',
				},
				user: 1,
			},
		},
	])

	res.status(200).json(topics)
})

module.exports = {
	createTopic,
	updateTopic,
	getAllTopics,
}
