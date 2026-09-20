import { NextFunction, Request, Response } from "express";
import Claim from "../models/claim.js";
import Item from "../models/item.js";

type UploadedCloudinaryFile = {
  path?: string;
  secure_url?: string;
};

export async function makeClaim(
  request: Request & { file?: UploadedCloudinaryFile },
  response: Response,
  next: NextFunction,
) {
  try {
    const {
      itemId,
      studentRegNo,
      challengeAnswer,
      userId,
      lostLocation,
      lostTime,
    } = request.body;

    // 1. Verify that the item exists and is claimable
    const item = await Item.findById(itemId);
    if (!item) {
      return response.status(404).json({ message: "Item not found." });
    }
    if (item.type !== "found" || !item.privateDetails) {
      return response
        .status(400)
        .json({ message: "This item cannot be claimed online." });
    }

    // 2. Get the Cloudinary Image URL (if the claimer uploaded a photo)
    const uploadedFile = request.file;
    const claimPicture =
      uploadedFile?.secure_url ||
      uploadedFile?.path ||
      request.body?.claimPicture ||
      undefined;

    // 3. Get user ID from the protect middleware (or fallback to request.body.userId)
    const activeUserId = (request as any).user?._id || userId;
    if (!activeUserId) {
      return response.status(401).json({ message: "User not authenticated." });
    }

    // 4. Create the claim with the Cloudinary picture included
    const claim = await Claim.create({
      item: itemId,
      registrationNo: studentRegNo,
      proofDescription: challengeAnswer,
      claimPicture, // <--- SAVES THE CLOUDINARY URL
      user: activeUserId,
      lostLocation,
      lostTime: lostTime ? new Date(lostTime) : new Date(),
    });

    return response.status(201).json(claim);
  } catch (error) {
    next(error);
  }
}