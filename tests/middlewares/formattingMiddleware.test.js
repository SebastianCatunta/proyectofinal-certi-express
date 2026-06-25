import { jest } from "@jest/globals";
import { responseFormatter, errorHandler } from "../../src/middlewares/formatingMiddleware.js";

describe("Formatting middleware", () => {
    test("responseFormatter should add res.success", () => {
        const req = {};
        const res = {};
        const next = jest.fn();

        responseFormatter(req, res, next);

        expect(typeof res.success).toBe("function");
        expect(next).toHaveBeenCalled();
    });

    test("res.success should send formatted response", () => {
        const req = {};
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const res = { status };
        const next = jest.fn();

        responseFormatter(req, res, next);

        res.success(200, "OK", { value: 1 });

        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith({
            success: true,
            message: "OK",
            data: { value: 1 }
        });
    });

    test("errorHandler should use statusCode", () => {
        const err = new Error("Custom error");
        err.statusCode = 400;

        const req = {};
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const res = { status };

        errorHandler(err, req, res);

        expect(status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith({
            success: false,
            message: "Custom error",
            errors: null
        });
    });

    test("errorHandler should handle CastError", () => {
        const err = new Error("Cast error");
        err.name = "CastError";

        const req = {};
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const res = { status };

        errorHandler(err, req, res);

        expect(status).toHaveBeenCalledWith(400);
        expect(json.mock.calls[0][0].message).toBe("Invalid ID format");
    });

    test("errorHandler should handle duplicated database values", () => {
        const err = new Error("Duplicate");
        err.code = 11000;

        const req = {};
        const json = jest.fn();
        const status = jest.fn(() => ({ json }));
        const res = { status };

        errorHandler(err, req, res);

        expect(status).toHaveBeenCalledWith(400);
        expect(json.mock.calls[0][0].message).toBe("Duplicated value in database");
    });
});