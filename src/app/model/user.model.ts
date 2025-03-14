export interface User {
    id: number;
    fullName: string;
    email: string;
    passwordHash?: string | null;
    googleId?: string | null;
    profilePictureUrl?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  }
  