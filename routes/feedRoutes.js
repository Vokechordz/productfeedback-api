const express = require('express')
const router = express.Router()
const feedbacksController = require('../controllers/feedbacksController')

router.route('/')
    .get(feedbacksController.getAllFeedbacks)
    .post(feedbacksController.createNewFeedback)
    .patch(feedbacksController.updateFeedback)
    .delete(feedbacksController.deleteFeedback)

module.exports = router