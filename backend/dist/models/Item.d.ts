import { Types } from "mongoose";
export type ItemType = "found" | "lost";
export interface IItem {
    itemName: string;
    publicDescription: string;
    category: string;
    location: string;
    dateLost: Date;
    dateFound: Date;
    privateDetails: string;
    pictureLink: string;
    type: ItemType;
    user: Types.ObjectId;
}
declare const Item: import("mongoose").Model<IItem, {}, {}, {}, import("mongoose").Document<unknown, {}, IItem, {}, import("mongoose").DefaultSchemaOptions> & IItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IItem>;
export default Item;
