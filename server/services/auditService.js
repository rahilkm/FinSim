const AuditLog = require('../models/AuditLog');

async function log(userId, action, metadata = {}) {
    await AuditLog.create({ user_id: userId, action, metadata });
}

module.exports = { log };
