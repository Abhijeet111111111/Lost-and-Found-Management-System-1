import { NextFunction, Request, Response } from "express";
type UploadedCloudinaryFile = {
    path?: string;
    secure_url?: string;
};
type ClaimRequest = Request & {
    file?: UploadedCloudinaryFile;
    user?: {
        _id: string;
    };
};
export declare function makeClaim(request: ClaimRequest, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getClaims(_request: Request, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateClaimStatus(request: Request, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function analyzeClaim(request: Request, response: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export {};
