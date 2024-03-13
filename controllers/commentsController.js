const Comment = require('../models/Comment')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all comments 
// @route GET /comments
// @access Private
const getAllComments = asyncHandler(async (req, res) => {
    // Get all comments from MongoDB
    const comments = await Comment.find().lean()

    // If no comments 
    if (!comments?.length) {
        return res.status(400).json({ message: 'No comments found' })
    }

    
    const commentsWithUser = await Promise.all(comments.map(async (comment) => {
        const user = await User.findById(comment.userId).lean().exec()
        return { ...comment, username: user.username }
    }))

    res.json(commentsWithUser)
})

// @desc Create new comment
// @route POST /comments
// @access Private
const createNewComment = asyncHandler(async (req, res) => {
    const { userId, feedbackId, content } = req.body

    // Confirm data
    if (!userId || !feedbackId || !content) {
        return res.status(400).json({ message: 'All fields are required' })
    }


    // Create and store the new comment 
    const comment = await Comment.create({ userId, feedbackId, content })

    if (comment) { // Created 
        return res.status(201).json({ message: 'New comment created' })
    } else {
        return res.status(400).json({ message: 'Invalid comment data received' })
    }

})

// @desc Update a comment
// @route PATCH /comment
// @access Private
const updateComment = asyncHandler(async (req, res) => {
    const { id, userId, feedbackId, content } = req.body

    // Confirm data
    if (!id || !userId || !feedbackId || !content) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm comment exists to update
    const comment = await Comment.findById(id).exec()

    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }


    comment.userId = userId
    comment.feedbackId = feedbackId
    comment.content = content

    const updatedComment = await comment.save()

    res.json(`'${updatedComment.content}' updated`)
})

// @desc Delete a comment
// @route DELETE /comments
// @access Private
const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Comment ID required' })
    }

    // Confirm comment exists to delete 
    const comment = await Comment.findById(id).exec()

    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }

    const result = await comment.deleteOne()

    const reply = `Comment '${result.content}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllComments,
    createNewComment,
    updateComment,
    deleteComment
}