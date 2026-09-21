import Item from "./../models/item.js";
import User from "./../models/user.js";
export async function getItems(request, response, next) {
    try {
        const rawItemId = request.query.id;
        const itemId = typeof rawItemId === "string" ? rawItemId : null;
        if (itemId) {
            const item = await Item.findById(itemId);
            if (!item) {
                return response.status(404).json({ message: "Item not found" });
            }
            return response.json(item);
        }
        const items = await Item.find({}).sort({
            createdAt: -1,
        });
        return response.json(items);
    }
    catch (error) {
        next(error);
    }
}
export async function createItem(request, response, next) {
    try {
        const uploadedFile = request.file;
        const pictureLink = uploadedFile?.secure_url ||
            uploadedFile?.path ||
            (typeof request.body?.pictureLink === "string" && request.body.pictureLink);
        if (!pictureLink) {
            return response.status(400).json({ message: "Please upload an image" });
        }
        // --- REPLACED SECTION STARTS HERE ---
        // 1. Get user ID from the token (protect middleware), or fallback to request.body.user
        const userId = request.user?._id || request.body.user;
        if (!userId) {
            return response.status(401).json({ message: "Not authorized or user not specified" });
        }
        // 2. Verify the user exists in database
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return response.status(404).json({ message: "User not found" });
        }
        // 3. Create the item linked to the authenticated user
        const item = await Item.create({
            ...request.body,
            pictureLink,
            user: foundUser._id,
        });
        // --- REPLACED SECTION ENDS HERE ---
        return response.status(201).json(item.toObject());
    }
    catch (error) {
        next(error);
    }
}
// Before, it was only looking at request.body.user. Now, it first checks if the logged-in user came from your protect middleware ((request as any).user._id), making your API much more secure!
//# sourceMappingURL=items.js.map