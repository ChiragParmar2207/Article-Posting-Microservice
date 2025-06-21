const Topic = require('../Topic/topicModel')
const Article = require('./articleModel')
const Comment = require('../Comment/commentModel')
const AppError = require('../Utils/appError')
const catchAsync = require('../Utils/catchAsync.js')
const mongoose = require('mongoose')
const { isMongoId } = require('validator')

// ==================== CREATE ARTICLE ====================
const createArticle = catchAsync(async (req, res, next) => {
	const topicExists = await Topic.findById(req.body.topicId)

	if (!topicExists) {
		return next(
			new AppError(
				'The topic you are creating an article is does not exist.',
				404
			)
		)
	}

	await Article.create({
		topicId: req.body.topicId,
		content: req.body.content,
		userId: req.userId,
	})

	res.status(201).json({
		message: 'Article Created Successfully.',
	})
})

// ==================== UPDATE ARTICLE ====================
const updateArticle = catchAsync(async (req, res, next) => {
	const article = await Article.findOne({
		_id: req.params.id,
		userId: req.userId,
	})

	if (!article) {
		return next(
			new AppError(
				'You can not update this article because You are not the author of this article.',
				404
			)
		)
	}

	await Article.findByIdAndUpdate(
		req.params.id,
		{
			content: req.body.content,
		},
		{ new: true }
	)

	res.status(200).json({
		message: 'Article Updated Successfully.',
	})
})

// ==================== DELETE ARTICLE ====================
const deleteArticle = catchAsync(async (req, res, next) => {
	if (!isMongoId(req.params.id))
		return next(new AppError('Provide valid article Id.', 400))

	const getArticle = await Article.findOne({
		_id: req.params.id,
		userId: req.userId,
	})

	if (!getArticle) {
		return next(
			new AppError(
				'You can not update this article because You are not the author of this article or article not found.',
				404
			)
		)
	}

	const article = await Article.findByIdAndDelete(req.params.id)

	await Comment.deleteMany({ articleId: article._id })

	res.status(200).json({
		message: 'Article deleted successfully.',
	})
})

// ==================== GET ALL ARTICLES ====================
const getAllArticles = catchAsync(async (req, res, next) => {
	const articles = await Article.aggregate([
		{
			$lookup: {
				from: 'users',
				localField: 'userId',
				foreignField: '_id',
				as: 'user',
			},
		},
		{
			$lookup: {
				from: 'topics',
				localField: 'topicId',
				foreignField: '_id',
				as: 'topic',
			},
		},
		{
			$unwind: '$user',
		},
		{
			$unwind: '$topic',
		},
		{
			$project: {
				_id: {
					id: '$_id',
					content: '$content',
				},
				user: 1,
				topic: 1,
			},
		},
	])

	res.status(200).json(articles)
})

// ==================== GET ARTICLES BY TOPIC ====================
const getArticlesByTopic = catchAsync(async (req, res, next) => {
	const articles = await Article.find({
		topicId: new mongoose.Types.ObjectId(req.params.topicId),
	})

	res.status(200).json(articles)
})

// ==================== GET MOST RECENT ARTICLES ====================
const getMostRecentArticles = catchAsync(async (req, res, next) => {
	const articles = await Article.aggregate([
		{
			$sort: { createdAt: -1 },
		},
		{
			$limit: Number(req.params.number),
		},
	])

	res.status(200).json(articles)
})

// ==================== GET ARTICLES OF FOLLOWING USER ====================
const getArticlesOfFollowingUsers = async (req, res, next) => {
	// const articles = await Followers.aggregate([
	// 	{
	// 		$lookup: {
	// 			from: 'articles',
	// 			localField: 'userId',
	// 			foreignField: 'userId',
	// 			as: 'articles',
	// 		},
	// 	},
	// 	{
	// 		$unwind: '$articles',
	// 	},
	// 	{
	// 		$match: {
	// 			followId: req.body.userId,
	// 		},
	// 	},
	// 	{
	// 		$project: {
	// 			_id: 0,
	// 			articles: 1,
	// 		},
	// 	},
	// ])
	// res.status(200).json({
	// 	length: articles.length,
	// 	articles,
	// })
}

module.exports = {
	createArticle,
	updateArticle,
	deleteArticle,
	getAllArticles,
	getArticlesByTopic,
	getMostRecentArticles,
	getArticlesOfFollowingUsers,
}
