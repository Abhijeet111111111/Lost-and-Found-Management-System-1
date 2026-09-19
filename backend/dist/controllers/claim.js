import Claim from "../models/claim.js";
import Item from "../models/item.js";
export async function makeClaim(request, response, next) {
    try {
        const { itemId, studentRegNo, challengeAnswer, userId, lostLocation, lostTime, } = request.body;
        const item = await Item.findById(itemId);
        if (!item)
            return response.status(404).json({ message: "Item not found." });
        if (item.type !== "found" || !item.privateDetails) {
            return response
                .status(400)
                .json({ message: "This item cannot be claimed online." });
        }
        const claim = await Claim.create({
            item: itemId,
            registrationNo: studentRegNo,
            proofDescription: challengeAnswer,
            user: userId,
            lostLocation,
            lostTime,
        });
        response.status(201).json(claim);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=claim.js.map