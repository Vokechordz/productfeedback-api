const Feedback = require('../models/Feedback')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all feedbacks 
// @route GET /feedbacks
// @access Private
const getAllFeedbacks = asyncHandler(async (req, res) => {
    // Get all feedbacks from MongoDB
    const feedbacks = await Feedback.find().lean()

    // If no feedbacks 
    if (!feedbacks?.length) {
        return res.status(400).json({ message: 'No feedbacks found' })
    }

    
    const feedbacksWithUser = await Promise.all(feedbacks.map(async (feedback) => {
        const user = await User.findById(feedback.userId).lean().exec()
        return { ...feedback, username: user.username }
    }))

    res.json(feedbacksWithUser)
})

// @desc Create new feedback
// @route POST /feedbacks
// @access Private
const createNewFeedback = asyncHandler(async (req, res) => {
    const { userId, title, details, category } = req.body

    // Confirm data
    if (!userId || !title || !details || !category) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Feedback.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate feedback title' })
    }

    // Create and store the new feedback 
    const feedback = await Feedback.create({ userId, title, details, category })

    if (feedback) { // Created 
        return res.status(201).json({ message: 'New feedback created' })
    } else {
        return res.status(400).json({ message: 'Invalid feedback data received' })
    }

})

// @desc Update a feedback
// @route PATCH /feedback
// @access Private
const updateFeedback = asyncHandler(async (req, res) => {
    const { id, userId, title, details, category, status, likes } = req.body

    // Confirm data
    if (!id || !userId || !title || !details || !category) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm feedback exists to update
    const feedback = await Feedback.findById(id).exec()

    if (!feedback) {
        return res.status(400).json({ message: 'Feedback not found' })
    }

    // Check for duplicate title
    const duplicate = await Feedback.findOne({ title }).lean().exec()

    // Allow renaming of the original feedback 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate feedback title' })
    }


    feedback.userId = userId
    feedback.title = title
    feedback.details = details
    feedback.category = category


    const updatedFeedback = await feedback.save()

    res.json(`'${updatedFeedback.title}' updated`)
})

// @desc Delete a feedback
// @route DELETE /feedbacks
// @access Private
const deleteFeedback = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Feedback ID required' })
    }

    // Confirm feedback exists to delete 
    const feedback = await Feedback.findById(id).exec()

    if (!feedback) {
        return res.status(400).json({ message: 'Feedback not found' })
    }

    const result = await feedback.deleteOne()

    const reply = `Feedback '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllFeedbacks,
    createNewFeedback,
    updateFeedback,
    deleteFeedback
}