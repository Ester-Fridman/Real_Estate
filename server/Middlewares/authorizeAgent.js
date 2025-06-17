const jwt = require('jsonwebtoken');
const authorizeAgent = (req, res, next) => {
    if (req.user.role !== 'agent') {
        return res.status(403).json({ message: 'Access denied: Agent role required' });
    }
    next();
}

module.exports = authorizeAgent;