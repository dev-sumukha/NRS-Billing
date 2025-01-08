import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({success: false, message: "Unauthorized - No token provided"});
  }

  const jwtToken = token.replace("Bearer", "").trim();

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    const message =
      error.name === "JsonWebTokenError"
        ? "Invalid token"
        : error.name === "TokenExpiredError"
        ? "Token expired"
        : "Unauthorized";

    res.status(401).json({success: false, message});
  }
}
