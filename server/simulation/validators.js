const Joi = require('joi');

const shockSchema = Joi.object({
    shock_type: Joi.string()
        .valid('job_loss', 'salary_reduction', 'medical_emergency', 'market_crash', 'inflation_spike')
        .required(),
    shock_duration_months: Joi.number().integer().min(1).max(24).required(),
    income_loss_percent: Joi.number().min(0).max(1).required(),
    unexpected_expense: Joi.number().min(0).default(0),
    market_drop_percent: Joi.number().min(0).max(1).default(0),
});

const decisionSchema = Joi.object({
    purchase_cost: Joi.number().min(0).required(),
    down_payment: Joi.number().min(0).default(0),
    interest_rate: Joi.number().min(0).max(25).required(),   // sent as percent e.g. 9 = 9% p.a.; 0 allowed for cash purchase
    loan_tenure_months: Joi.number().integer().min(0).max(360).required(),   // 0 allowed for full cash purchase
});

// Item helpers
const incomeSourceSchema = Joi.object({
    name: Joi.string().default('Source'),
    amount: Joi.number().min(0).default(0),
});

const expenseItemSchema = Joi.object({
    name: Joi.string().default('Expense'),
    amount: Joi.number().min(0).default(0),
});

const assetItemSchema = Joi.object({
    name: Joi.string().default('Asset'),
    value: Joi.number().min(0).default(0),
});

const liabilityItemSchema = Joi.object({
    name: Joi.string().default('Liability'),
    value: Joi.number().min(0).default(0),
});

const profileSchema = Joi.object({
    income_sources: Joi.array().items(incomeSourceSchema).default([]),
    expenses:       Joi.array().items(expenseItemSchema).default([]),
    assets:         Joi.array().items(assetItemSchema).default([]),
    liabilities:    Joi.array().items(liabilityItemSchema).default([]),
    existing_emi:   Joi.number().min(0).default(0),
    inflation_rate: Joi.number().min(0).max(1).default(0.06),
});

module.exports = { shockSchema, decisionSchema, profileSchema };
