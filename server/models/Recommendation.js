const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        simulation_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Simulation',
        },
        recommendation_text: { type: String, required: true },
        recommendation_type: {
            type: String,
            enum: ['debt', 'savings', 'expense', 'investment'],
            required: true,
        },
    },
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
