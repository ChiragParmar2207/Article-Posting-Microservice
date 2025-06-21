const express = require('express')
const router = express.Router()
const {
	createTopicMiddleware,
	updateTopicMiddleware,
} = require('./topicMiddleware')
const { createTopic, updateTopic, getAllTopics } = require('./topicController')
const { protect } = require('../Utils/authMiddleware')

router
	.route('/')
	.get(getAllTopics)
	.post(protect, createTopicMiddleware, createTopic)

router.route('/:topicId').patch(protect, updateTopicMiddleware, updateTopic)

module.exports = router
