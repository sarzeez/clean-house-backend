import { Role } from '../entity/user.entity';

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
}
