import { NextFunction, Request, Response } from "express";
import Claim from "../models/claim.js";
import Item from "../models/item.js";

type UploadedCloudinaryFile = {
  path?: string;
  secure_url?: string;
};

type ClaimRequest = Request & {
  file?: UploadedCloudinaryFile;
  user?: { _id: string };
};

export async function makeClaim(
  request: ClaimRequest,
  response: Response,
  next: NextFunction,
) {
  try {
    const itemId = request.body.itemId;
    const studentRegNo = request.body.studentRegNo ?? request.body.claimantContact;
    const challengeAnswer = request.body.challengeAnswer ?? request.body.verificationAnswers;
    const userId = request.user?._id ?? request.body.userId;
    const lostLocation = request.body.lostLocation ?? "Not provided";
    const lostTime = request.body.lostTime;

    if (!itemId || !studentRegNo || !challengeAnswer) {
      return response.status(400).json({
        message: "Item, student ID, and verification answers are required.",
      });
    }

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
    if (!userId) {
      return response.status(401).json({ message: "User not authenticated." });
    }

    // 4. Create the claim with the Cloudinary picture included
    const claim = await Claim.create({
      item: itemId,
      registrationNo: studentRegNo,
      proofDescription: challengeAnswer,
      claimPicture, // <--- SAVES THE CLOUDINARY URL
      user: userId,
      lostLocation,
      lostTime: lostTime ? new Date(lostTime) : new Date(),
      status: "pending",
    });

    return response.status(201).json(claim.toObject());
  } catch (error) {
    next(error);
  }
}

export async function getClaims(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const claims = await Claim.find()
      .populate("item", "itemName publicDescription privateDetails category location pictureLink")
      .populate("user", "name email registrationNo")
      .sort({ createdAt: -1 });

    return response.json(
      claims.map((claim: any) => ({
        id: claim._id.toString(),
        itemId: claim.item?._id?.toString(),
        item: claim.item,
        claimantName: claim.user?.name ?? "Unknown claimant",
        claimantContact: claim.registrationNo,
        verificationAnswers: claim.proofDescription,
        status: claim.status ?? "pending",
        dateSubmitted: claim.createdAt ?? claim.lostTime,
      })),
    );
  } catch (error) {
    next(error);
  }
}

export async function updateClaimStatus(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { status } = request.body as { status?: string };
    if (status !== "approved" && status !== "rejected") {
      return response.status(400).json({ message: "Status must be approved or rejected." });
    }

    const claim = await Claim.findByIdAndUpdate(
      request.params.id,
      { status },
      { new: true, runValidators: true },
    );
    if (!claim) {
      return response.status(404).json({ message: "Claim not found." });
    }

    return response.json({ id: claim._id.toString(), status: claim.status });
  } catch (error) {
    next(error);
  }
}

function words(value: string): Set<string> {
  return new Set(value.toLowerCase().match(/[a-z0-9]+/g) ?? []);
}

export async function analyzeClaim(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const claim = await Claim.findById(request.params.id);
    if (!claim) {
      return response.status(404).json({ error: "Claim not found" });
    }

    const item = await Item.findById(claim.item);
    const answerWords = words(claim.proofDescription || request.body.verificationAnswers || "");
    const detailWords = words(item?.privateDetails || request.body.privateDetails || "");
    const matchingPoints = [...answerWords].filter((word) => detailWords.has(word));
    const matchPercentage = detailWords.size
      ? Math.min(100, Math.round((matchingPoints.length / detailWords.size) * 100))
      : 0;

    return response.json({
      matchPercentage,
      verdict: matchPercentage >= 75 ? "RECOMMENDED_APPROVE" : matchPercentage >= 50 ? "INSUFFICIENT_PROOF" : "SUSPICIOUS_DISCREPANCY",
      confidence: matchingPoints.length > 2 ? "HIGH" : matchingPoints.length > 0 ? "MEDIUM" : "LOW",
      summary: matchingPoints.length
        ? `The answer matches ${matchingPoints.length} identifying detail${matchingPoints.length === 1 ? "" : "s"}.`
        : "No matching identifying details were found.",
      matchingPoints: matchingPoints.map((word) => `Matched detail: ${word}`),
      discrepancies: matchingPoints.length ? [] : ["Ask the claimant for more specific identifying details."],
      recommendationAction: matchPercentage >= 75 ? "Review the evidence and consider approving the claim." : "Do not approve until the claimant provides stronger proof.",
      engine: "keyword-match",
    });
  } catch (error) {
    next(error);
  }
}