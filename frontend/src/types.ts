export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'claimed' | 'returned' | 'disposed';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: string;
  location: string;
  dateReported?: string;
  createdAt?: string;
  incidentDate: string;
  photoUrl?: string;
  imageUrl?: string;
  status: ItemStatus;
  
  privateDetails?: string; 
}

export interface Claim {
  id: string;
  itemId: string;
  claimantName: string;
  claimantContact: string;
  verificationAnswers: string;
  status: 'pending' | 'approved' | 'rejected';
  dateSubmitted: string;
}

// DTO for public board - strictly omits privateDetails
export type PublicItemDTO = Omit<Item, 'privateDetails'> & {
  _id: string;
  itemName: string;
  publicDescription: string;
  pictureLink?: string;
};

export interface AuthUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  registrationNo: string;
  role: 'student' | 'admin';
}
