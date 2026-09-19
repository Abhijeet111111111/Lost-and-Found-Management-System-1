import { NextFunction, Request, Response } from "express";
export declare function getItems(request: Request, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createItem(request: Request, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
