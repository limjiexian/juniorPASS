const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  // get token and method from header
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Split the authorization header into parts
    const parts = authHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      const jwtToken = parts[1]; // Extract the token from the header
      try {
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user; // Attach user data to request object

        next();
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res
            .status(401)
            .json({ error: "ERROR in Authorization: Token expired" });
        } else if (err instanceof jwt.JsonWebTokenError)
          return res
            .status(401)
            .json({ error: "ERROR in Authorization: Invalid JWT" });
        return res
          .status(500)
          .json({ error: "ERROR in Authorization: Server error" });
      }
    } else {
      // Invalid authorization header format
      return res.status(401).json({ error: "Invalid authorization header" });
    }
  } else {
    // Authorization header not present
    return res.status(401).json({ error: "Authorization header missing" });
  }
};
