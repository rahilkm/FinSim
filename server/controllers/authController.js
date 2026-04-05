const authService = require('../services/authService');
const auditService = require('../services/auditService');

exports.register = async (req, res, next) => {
    try {
        const { full_name, email, password } = req.body;
        const result = await authService.register(full_name, email, password);
        await auditService.log(result.user_id, 'REGISTER');
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        await auditService.log(result.user_id, 'LOGIN');
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user._id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};
