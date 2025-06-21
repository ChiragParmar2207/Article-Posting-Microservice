const AppError = require('../Utils/appError')
const { isMongoId } = require('validator')

const createArticleMiddleware = async (req, res, next) => {
	const missingValue = []
	if (!req.body.topicId) missingValue.push('Provide Topic id')
	if (!req.body.content) missingValue.push('Provide Article content')

	if (missingValue.length > 0)
		return next(
			new AppError(`requird missing values : ${missingValue}`, 400)
		)

	next()
}

const updateArticleMiddleware = async (req, res, next) => {
	if (!isMongoId(req.params.id))
		return next(new AppError('Provide valid Article ID', 400))
	if (!req.body.content)
		return next(new AppError(`Provide Content of an article`, 400))

	next()
}

module.exports = {
	createArticleMiddleware,
	updateArticleMiddleware,
}
