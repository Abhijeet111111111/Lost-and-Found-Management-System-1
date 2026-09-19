declare class AppError extends Error {
    status: "fail" | "error";
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export default AppError;
