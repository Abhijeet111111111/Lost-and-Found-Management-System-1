import { HydratedDocument, Model } from "mongoose";
export type UserRole = "student" | "security" | "admin" | "teacher";
export interface IUser {
    name: string;
    registrationNo: string;
    email: string;
    password: string;
    confirmPassword: string;
    passwordChangedAt?: Date;
    role: UserRole;
}
export interface IUserMethods {
    verifyPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
    passwordChangedAfter(jwtTimestamp: number): boolean;
}
export type UserDocument = HydratedDocument<IUser, IUserMethods>;
declare const User: Model<IUser, {}, IUserMethods, {}, import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & Omit<IUser & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id" | keyof IUserMethods> & import("mongoose").HydratedDocumentOverrides<IUserMethods & {
    id: string;
}>, any, IUser>;
export default User;
