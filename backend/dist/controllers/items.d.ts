import { NextFunction, Request, Response } from "express";
type UploadedCloudinaryFile = {
    path?: string;
    secure_url?: string;
};
export declare function getItems(request: Request, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function createItem(request: Request & {
    file?: UploadedCloudinaryFile;
}, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export {};
