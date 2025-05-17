export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  phone?: string;
  address?: string;
}
export interface LoginUser {
  user: User;
  accessToken: string;
}
