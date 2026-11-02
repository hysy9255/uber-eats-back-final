export enum UserRole {
  Client = 'client',
  Owner = 'owner',
}

export type User = {
  userId: string;
  password: string;
  userRole: UserRole;
};

export abstract class FindUser {
  abstract findOne(email: string): Promise<User>;
}
