/**
 * Creates an Express middleware that validates req.body against a Joi schema.
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const messages = error.details.map((d) => d.message);
            return res.status(400).json({ error: true, message: messages.join('; ') });
        }

        req.body = value; // use validated + stripped body
        next();
    };
};

module.exports = validate;
