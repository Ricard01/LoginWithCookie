export interface IUserVm {
  users: IUser[]
}

export class IUser {
  id!: number;
  userName!: string;
  name!: string;
  email?: string;
  profilePictureUrl?: string
  userRoles!: IUserRole[];
}

interface IUserRole {
  roleName: string;
}

export interface IResult {
  id: 'string',
  isUser: boolean,
  succeeded: boolean;
  errors: [];
}
