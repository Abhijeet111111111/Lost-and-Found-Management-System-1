class AppError extends Error {
    status;
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;
//# sourceMappingURL=AppError.js.map