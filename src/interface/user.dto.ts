export interface User {
    id: string;
    email: string;
    name: string
}
export interface LoginUser {
   user: User;
   accessToken: string
}