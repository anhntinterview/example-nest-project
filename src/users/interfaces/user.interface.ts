import { UserEntity } from '../entities/user.entity';

export interface UserData {
  username: string;
  email: string;
  bio: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}

export interface UsersRO {
  list: UserEntity[];
  count: number;
}
