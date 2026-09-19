import { Types } from "mongoose";
export interface IClaim {
    user: Types.ObjectId;
    item: Types.ObjectId;
    registrationNo: string;
    proofDescription: string;
    claimPicture?: string;
    lostLocation: string;
    lostTime: Date;
}
declare const Claim: import("mongoose").Model<IClaim, {}, {}, {}, import("mongoose").Document<unknown, {}, IClaim, {}, import("mongoose").DefaultSchemaOptions> & IClaim & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IClaim>;
export default Claim;
