const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        simulation_type: {
            type: String,
            enum: ['shock', 'decision', 'resilience'],
            required: true,
            index: true,
        },
        input_parameters: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        result_metrics: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { timestamps: { createdAt: 'created_at' } }
);

module.exports = mongoose.model('Simulation', simulationSchema);
