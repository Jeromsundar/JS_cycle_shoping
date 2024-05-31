const User = require("../models/usermodels");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1]; 
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log(decoded);
                // Optionally, you can attach the user data to the request object here
                // req.user = await User.findById(decoded.id).select('-password');
                next(); // Don't forget to call next() to pass control to the next middleware
            }
        } catch (error) {
            res.status(401);
            throw new Error('Not Authorized token. Please login Again');
        }
    } else {
        res.status(401);
        throw new Error('There is no token attached to header');
    }
});

module.exports = { authMiddleware };
