import { model, Schema } from "mongoose";
const claimSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the user making the claim"],
        // unique: true,
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: [true, "Please provide the item being claimed"],
        // unique: true,
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
claimSchema.index({ user: 1, item: 1 }, { unique: true });
const Claim = model("Claim", claimSchema);
export default Claim;
// user: { unique: true }: In MongoDB, this means one user can only ever submit 1 claim in their entire life. If they try to claim a second item in the future, MongoDB will throw an E11000 duplicate key error.
// item: { unique: true }: This means only 1 person can claim an item. If someone submits a false claim first, the real owner will be blocked from claiming it.
//# sourceMappingURL=claim.js.map