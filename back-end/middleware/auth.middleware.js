const jwt = require('jsonwebtoken');
const User = require('../Models/User.Model');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticationForUser = async (req, res, next) => {
    try {
        const token = req.cookies?.authToken || req.header('Authorization')?.replace('Bearer ', '');
        // console.log("from mid", token)
        if (!token) {
            console.log("no token in middleware")
            return res.status(401).json({ msg: 'Login required, authorization denied' });
        }
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Find user by id
        const user = await User.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }
        
        // Add user to request object
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticationForUser;