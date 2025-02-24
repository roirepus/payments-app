import jwt from "jsonwebtoken";
import 'dotenv/config.js'

const jwtSecret = process.env.JWT_SECRET

export const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization

	if (!authHeader || !authHeader.startsWith("Bearer")) {
		return res.status(403).json({
			msg: "Invalid authorization token"
		})
	}

	try {
	const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, jwtSecret);
		req.userId = decoded.userId;
		console.log("auth passed")
		console.log(req.userId)
		next();
	} catch (error) {
		console.log("Error verifying auth token ", error)
		return res.status(403).json({
			msg: "Invalid auth token"
		})
	}


}
