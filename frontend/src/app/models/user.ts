export type Genre = 'M' | 'F' | 'N';
export interface ILevelAccess {
  create: boolean;
  delete: boolean;
  name: string;
  page: number;
  read: boolean;
  router: string;
  update: boolean;
}
export interface IUser {
  id: number;
  level_access: ILevelAccess[];
}

export interface IToken {
  token: string;
}
