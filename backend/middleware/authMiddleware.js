const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    try {
        // Get the token from the cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET);

        // Find the user based on the decoded token
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return res.status(401).json({ msg: 'Invalid token, user not found' });
        }

        // Attach the user object to the request for further use
        req.user = user;

        // Call next middleware
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
