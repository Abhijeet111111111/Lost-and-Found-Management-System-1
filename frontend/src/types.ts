export type ItemType = "lost" | "found";
export type ItemStatus = "open" | "claimed" | "returned" | "disposed";

export interface Item {
  _id: string;
  type: ItemType;
  itemName: string;
  publicDescription: string;
  category: string;
  location: string;
  dateReported?: string;
  createdAt?: string;
  incidentDate: string;
  photoUrl?: string;
  pictureLink?: string;
  status: ItemStatus;

  // Only for 'found' items - these are the hidden identifying details
  privateDetails?: string;
}

export interface Claim {
  id: string;
  itemId: string;
  claimantName: string;
  claimantContact: string;
  verificationAnswers: string;
  status: "pending" | "approved" | "rejected";
  dateSubmitted: string;
}

// DTO for public board - strictly omits privateDetails
export type PublicItemDTO = Omit<Item, "privateDetails">;
