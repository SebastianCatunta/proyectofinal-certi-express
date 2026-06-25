import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        const error = new Error("Authorization header required");
        error.statusCode = 401;
        return next(error);
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
        const error = new Error("Invalid authorization header format");
        error.statusCode = 401;
        return next(error);
    }

    const token = parts[1];

    if (!process.env.JWT_SECRET) {
        const error = new Error("JWT secret is not configured");
        error.statusCode = 500;
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        return next();
    } catch (error) {
        const authError = new Error("Invalid or expired token");
        authError.statusCode = 401;
        return next(authError);
    }
}