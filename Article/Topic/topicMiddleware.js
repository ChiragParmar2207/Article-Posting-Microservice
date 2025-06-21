const { isMongoId } = require('validator')
const AppError = require('../Utils/appError')

const createTopicMiddleware = async (req, res, next) => {
	if (!req.body.topicName)
		return next(new AppError(`Provide Topic Name`, 400))

	next()
}

const updateTopicMiddleware = async (req, res, next) => {
	if (!isMongoId(req.params.topicId))
		return next(new AppError('Provide valid Topic ID', 400))

	if (!req.body.topicName)
		return next(new AppError(`Provide Topic Name`, 400))

	next()
}

module.exports = {
	createTopicMiddleware,
	updateTopicMiddleware,
}
