class AppError extends Error {
  status: "fail" | "error";
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;


