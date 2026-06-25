export function requestLogger(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
        if (process.env.NODE_ENV !== "test") {
            const duration = Date.now() - start;
            console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
        }
    });

    next();
}