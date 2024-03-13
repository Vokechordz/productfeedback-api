const express = require('express')
const router = express.Router()
const repliesController = require('../controllers/repliesController')

router.route('/')
    .get(repliesController.getAllReplies)
    .post(repliesController.createNewReply)
    .patch(repliesController.updateReply)
    .delete(repliesController.deleteReply)

module.exports = router