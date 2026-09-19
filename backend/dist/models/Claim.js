import { model, Schema } from "mongoose";
const claimSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the user making the claim"],
        unique: true,
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: [true, "Please provide the item being claimed"],
        unique: true,
    },
    registrationNo: {
        type: String,
        required: [true, "Please provide the registration number"],
    },
    proofDescription: {
        type: String,
        required: [true, "Please provide proof or a description"],
    },
    claimPicture: {
        type: String,
    },
    lostLocation: {
        type: String,
        required: [true, "Please provide the location where the item was lost"],
    },
    lostTime: {
        type: Date,
        required: [true, "Please provide when the item was lost"],
    },
});
const Claim = model("Claim", claimSchema);
export default Claim;
//# sourceMappingURL=claim.js.map