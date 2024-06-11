export interface IUserVm {
  users: IUser[]
}

export class IUser {
  id!: number;
  username!: string;
  name!: string;
  email?: string;
  profilePictureUrl?: string
  role?: string
}

export interface IResult {
  id: 'string',
  isUser: boolean,
  succeeded: boolean;
  errors: [];
}
