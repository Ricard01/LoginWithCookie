export interface IUserSession {
  id?: string;
  name?: string;
  profilePictureUrl?: string;
  role?: string;
  permissions?: [];
}

export interface ICredentials {
  email: string;
  password: string;
  returnUrl?: string;
}


export interface IUserForAuthentication {
  email: string;
  password: string;
}
