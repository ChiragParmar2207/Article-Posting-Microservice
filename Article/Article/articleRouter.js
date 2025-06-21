const express = require('express')
const router = express.Router()
const { protect } = require('../Utils/authMiddleware')
const {
	createArticleMiddleware,
	updateArticleMiddleware,
} = require('./articleMiddleware')
const {
	createArticle,
	updateArticle,
	deleteArticle,
	getAllArticles,
	getArticlesByTopic,
	getMostRecentArticles,
	getArticlesOfFollowingUsers,
} = require('./articleController')

router.use(protect)

router
	.route('/')
	.post(createArticleMiddleware, createArticle)
	.get(getAllArticles)

router
	.route('/:id')
	.patch(updateArticleMiddleware, updateArticle)
	.delete(deleteArticle)

router.route('/getMostRecentArticles/:number').get(getMostRecentArticles)

router.route('/getArticlesOfFollowingUsers').get(getArticlesOfFollowingUsers)

router.route('/:topicId').get(getArticlesByTopic)

module.exports = router
