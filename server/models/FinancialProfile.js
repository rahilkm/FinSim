const mongoose = require('mongoose');

const namedAmountSchema = new mongoose.Schema(
    { name: { type: String, required: true }, amount: { type: Number, required: true, min: 0 } },
    { _id: false }
);

const namedValueSchema = new mongoose.Schema(
    { name: { type: String, required: true }, value: { type: Number, required: true, min: 0 } },
    { _id: false }
);

const financialProfileSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        // Structured arrays
        income_sources: { type: [namedAmountSchema], default: [] },
        expenses:       { type: [namedAmountSchema], default: [] },
        assets:         { type: [namedValueSchema],  default: [] },
        liabilities:    { type: [namedValueSchema],  default: [] },

        // Other scalar fields
        existing_emi:   { type: Number, default: 0, min: 0 },
        inflation_rate: { type: Number, default: 0.06 },

        // Derived computed totals (written by profileService on every save)
        monthly_income:    { type: Number, default: 0 },
        monthly_expenses:  { type: Number, default: 0 },
        total_assets:      { type: Number, default: 0 },
        total_liabilities: { type: Number, default: 0 },

        // Savings and investments — derived from assets array by name lookup
        // Kept as convenience scalars so simulation engines can read them directly
        savings:     { type: Number, default: 0 },
        investments: { type: Number, default: 0 },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('FinancialProfile', financialProfileSchema);
