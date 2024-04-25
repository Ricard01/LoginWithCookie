export interface IUserSession {
  id?: string;
  name?: string;
  profilePictureUrl?: string;
  role?: string;
  permissions?: [];
}


export interface IUserForAuthentication {
  email: string;
  password: string;
}
