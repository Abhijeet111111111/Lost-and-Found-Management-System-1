import { NextFunction, Request, Response, RequestHandler } from "express";

type AsyncRequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction,
) => Promise<unknown>;

const catchAsync = (fn: AsyncRequestHandler): RequestHandler => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

export default catchAsync;
