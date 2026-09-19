import { NextFunction, Request, Response, RequestHandler } from "express";
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
declare const catchAsync: (fn: AsyncRequestHandler) => RequestHandler;
export default catchAsync;
