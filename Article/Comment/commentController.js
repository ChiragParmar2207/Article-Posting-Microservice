const Comment = require('./commentModel')
const Article = require('../Article/articleModel')
const AppError = require('../Utils/appError')
const catchAsync = require('../Utils/catchAsync')
const { isMongoId } = require('validator')

// ==================== CREATE COMMENT ====================
const createComment = catchAsync(async (req, res, next) => {
	const articleExists = await Article.findById(req.body.articleId)

	if (!articleExists) {
		return next(
			new AppError(
				'The article you are creating a comment is does not exist',
				404
			)
		)
	}

	await Comment.create({
		comment: req.body.comment,
		articleId: req.body.articleId,
		rating: req.body.rating,
		userId: req.userId,
	})

	res.status(201).json({
		message: 'Comment Created successfully.',
	})
})

// ==================== UPDATE COMMENT ====================
const updateComment = catchAsync(async (req, res, next) => {
	const comment = await Comment.findOne({
		_id: req.params.id,
		userId: req.userId,
	})

	if (!comment) {
		return next(
			new AppError(
				'You can not update this comment because You are not the author of this comment or omment not found.',
				404
			)
		)
	}

	const updatedData = await Comment.findByIdAndUpdate(
		req.params.id,
		{
			comment: req.body.comment,
			rating: req.body.rating,
		},
		{ new: true }
	)

	res.status(200).json({
		message: 'Comment updated successfully.',
	})
})

// ==================== DELETE COMMENT ====================
const deleteComment = catchAsync(async (req, res, next) => {
	if (!isMongoId(req.params.id))
		return next(new AppError('Provide valid Comment Id.', 400))

	const comment = await Comment.findOne({
		_id: req.params.id,
		userId: req.userId,
	})

	if (!comment) {
		return next(
			new AppError(
				'You can not delete this comment because You are not the author of this comment or omment not found.',
				404
			)
		)
	}

	await Comment.findByIdAndDelete(req.params.id)

	res.status(200).json({
		message: 'Comment deleted successfully.',
	})
})

// ==================== GET ALL COMMENTS OF PERTICULAR ARTICLE ====================
const getAllCommentsOfParticularArticle = catchAsync(async (req, res) => {
	if (!isMongoId(req.params.id))
		return next(new AppError('Provide valid Article ID', 400))

	const comments = await Comment.find({ articleId: req.params.articleId })

	res.status(200).json(comments)
})

module.exports = {
	createComment,
	updateComment,
	deleteComment,
	getAllCommentsOfParticularArticle,
}
