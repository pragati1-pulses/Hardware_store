const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hardware_key';

module.exports = (req, res, next) => {
    // Get the token from the request headers
    const authHeader = req.header('Authorization');
    
    // Check if token exists and format is "Bearer <token>"
    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1]; // Extract the token part

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach the decoded user data (id, role) to req.user
        req.user = decoded; 
        
        next(); // Move to the actual controller function
    } catch (ex) {
        res.status(400).json({ error: "Invalid or expired token." });
    }
};