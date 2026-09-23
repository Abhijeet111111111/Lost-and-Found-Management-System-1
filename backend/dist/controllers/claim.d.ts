import { NextFunction, Request, Response } from "express";
type UploadedCloudinaryFile = {
    path?: string;
    secure_url?: string;
};
export declare function makeClaim(request: Request & {
    file?: UploadedCloudinaryFile;
}, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export {};
