import { model, Schema } from "mongoose";
const itemSchema = new Schema({
    itemName: {
        type: String,
        required: [true, "Please provide the item name"],
    },
    publicDescription: {
        type: String,
        required: [true, "Please provide a public description"],
    },
    category: {
        type: String,
        required: [true, "Please provide the item category"],
    },
    location: {
        type: String,
        required: [true, "Please provide the item location"],
    },
    dateLost: {
        type: Date,
        required: [false, "Please provide the date the item was lost"],
    },
    dateFound: {
        type: Date,
        required: [false, "Please provide the date the item was found"],
    },
    privateDetails: {
        type: String,
<<<<<<< HEAD
        required: [false, "Please provide private verification details"],
=======
        // Required ONLY when type is "found", completely optional for "lost" items!
        required: function () {
            return this.type === "found";
        },
>>>>>>> 04852e9cc913c37d7586a7e9e4acafe643919326
    },
    pictureLink: {
        type: String,
        required: [true, "Please provide a picture link"],
    },
    type: {
        type: String,
        enum: ["found", "lost"],
        required: [true, "Please specify whether the item was found or lost"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the user who reported the item"],
    },
});
const Item = model("Item", itemSchema);
export default Item;
//# sourceMappingURL=item.js.map