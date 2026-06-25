import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import { authenticate } from "../../src/middlewares/authenticationMiddleware.js";
import { authorize } from "../../src/middlewares/authorizationMiddleware.js";

describe("Authentication and authorization middlewares", () => {
    test("authenticate should accept a valid token", () => {
        process.env.JWT_SECRET = "test_secret_key_2026";

        const token = jwt.sign(
            {
                userId: "user123",
                role: "admin"
            },
            process.env.JWT_SECRET
        );

        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        };

        const res = {};
        const next = jest.fn();

        authenticate(req, res, next);

        expect(req.user).toBeDefined();
        expect(req.user.role).toBe("admin");
        expect(next).toHaveBeenCalledWith();
    });

    test("authenticate should reject missing token", () => {
        const req = {
            headers: {}
        };

        const res = {};
        const next = jest.fn();

        authenticate(req, res, next);

        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error.statusCode).toBe(401);
    });

    test("authenticate should reject invalid token", () => {
        const req = {
            headers: {
                authorization: "Bearer invalid.token.here"
            }
        };

        const res = {};
        const next = jest.fn();

        authenticate(req, res, next);

        expect(next).toHaveBeenCalled();
        const error = next.mock.calls[0][0];
        expect(error.statusCode).toBe(401);
    });

    test("authorize should allow valid role", () => {
        const req = {
            user: {
                role: "admin"
            }
        };

        const res = {};
        const next = jest.fn();

        authorize("admin", "teacher")(req, res, next);

        expect(next).toHaveBeenCalledWith();
    });

    test("authorize should reject invalid role", () => {
        const req = {
            user: {
                role: "student"
            }
        };

        const res = {};
        const next = jest.fn();

        authorize("admin")(req, res, next);

        const error = next.mock.calls[0][0];
        expect(error.statusCode).toBe(403);
    });

    test("authorize should reject unauthenticated user", () => {
        const req = {};
        const res = {};
        const next = jest.fn();

        authorize("admin")(req, res, next);

        const error = next.mock.calls[0][0];
        expect(error.statusCode).toBe(401);
    });
});