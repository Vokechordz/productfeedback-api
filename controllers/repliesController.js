const Reply = require('../models/Reply')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all replies 
// @route GET /replies
// @access Private
const getAllReplies = asyncHandler(async (req, res) => {
    // Get all replies from MongoDB
    const replies = await Reply.find().lean()

    // If no replies 
    if (!replies?.length) {
        return res.status(400).json({ message: 'No replies found' })
    }

    
    const repliesWithUser = await Promise.all(replies.map(async (reply) => {
        const user = await User.findById(reply.userId).lean().exec()
        return { ...reply, username: user.username }
    }))

    res.json(repliesWithUser)
})

// @desc Create new reply
// @route POST /replies
// @access Private
const createNewReply = asyncHandler(async (req, res) => {
    const { userId, commentId, content } = req.body
   
    // Confirm data
    if (!userId || !commentId || !content) {
        return res.status(400).json({ message: 'All fields are required' })
    }


    // Create and store the new reply
    const reply = await Reply.create({ userId, commentId, content })

    if (reply) { // Created 
        return res.status(201).json({ message: 'New replv created' })
    } else {
        return res.status(400).json({ message: 'Invalid replv data received' })
    }

})

// @desc Update a replv
// @route PATCH /replv
// @access Private
const updateReply = asyncHandler(async (req, res) => {
    const { id, userId, commentId, content } = req.body

    // Confirm data
    if (!id || !userId || !commentId || !content) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm comment exists to update
    const reply = await Reply.findById(id).exec()

    if (!comment) {
        return res.status(400).json({ message: 'Reply not found' })
    }


    Reply.userId = userId
    Reply.commentId = commentId
    Reply.content = content

    const updatedReply = await reply.save()

    res.json(`'${updatedReply.content}' updated`)
})

// @desc Delete a reply
// @route DELETE /replies
// @access Private
const deleteReply = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Reply ID required' })
    }

    // Confirm comment exists to delete 
    const reply = await Reply.findById(id).exec()

    if (!reply) {
        return res.status(400).json({ message: 'Reply not found' })
    }

    const result = await reply.deleteOne()

    const replyy = `Reply '${result.content}' with ID ${result._id} deleted`

    res.json(replyy)
})

module.exports = {
    getAllReplies,
    createNewReply,
    updateReply,
    deleteReply
}