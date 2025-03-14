import { User } from "./user.model";
export interface AuthResponse {
    message: string;
    result: boolean;
    data: {
      token: string;
      user: User;
    };
  }
  