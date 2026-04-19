import { User } from "./User";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatarId: User['avatarId'];
}
