import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/user.js";
export declare const signup: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const login: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const logout: (req: Request, res: Response) => void;
export declare const protect: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const restrictTo: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
