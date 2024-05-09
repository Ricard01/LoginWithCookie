export interface IAuthUser {
  id?: string;
  name?: string;
  profilePictureUrl?: string;
  role?: string;
  permissions?: [];
}

export interface ICredentials {
  email: string;
  password: string;
}

export interface IAuthResult {
  isSuccess: string;
  message: string;
}
