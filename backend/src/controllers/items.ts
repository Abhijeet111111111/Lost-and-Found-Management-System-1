import { NextFunction, Request, Response } from "express";
import Item from "./../models/item.js";
import User from "./../models/user.js";

type UploadedCloudinaryFile = {
  path?: string;
  secure_url?: string;
};

export async function getItems(
  request: Request,
  response: Response,
  next: NextFunction,
) {
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

    const items = await Item.find().sort({
      createdAt: -1,
    });

    return response.json(items);
  } catch (error) {
    next(error);
  }
}

export async function createItem(
  request: Request & { file?: UploadedCloudinaryFile },
  response: Response,
  next: NextFunction,
) {
  try {
    const uploadedFile = request.file;
    const pictureLink =
      uploadedFile?.secure_url ||
      uploadedFile?.path ||
      (typeof request.body?.pictureLink === "string" &&
        request.body.pictureLink);

    if (!pictureLink) {
      return response.status(400).json({ message: "Please upload an image" });
    }

    const foundUser = await User.findById(request.body.user);

    if (!foundUser) {
      return response.status(404).json({ message: "User not found" });
    }

    const item = await Item.create({
      ...request.body,
      pictureLink,
      user: foundUser._id,
    });

    return response.status(201).json(item.toObject());
  } catch (error) {
    next(error);
  }
}
