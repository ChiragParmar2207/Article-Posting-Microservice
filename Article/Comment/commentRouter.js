const express = require('express')
const router = express.Router()
const { protect } = require('../Utils/authMiddleware')
const {
	createCommentMiddleware,
	updateCommentMiddleware,
} = require('./commentMiddleware')
const {
	createComment,
	updateComment,
	deleteComment,
	getAllCommentsOfParticularArticle,
} = require('./commentController')

router.use(protect)

router.route('/').post(createCommentMiddleware, createComment)

router
	.route('/:id')
	.patch(updateCommentMiddleware, updateComment)
	.delete(deleteComment)

router
	.route('/getAllCommentsOfParticularArticle/:articleId')
	.get(getAllCommentsOfParticularArticle)

module.exports = router
