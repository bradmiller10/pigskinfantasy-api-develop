import { UserRole } from '../enums';

export interface JwtPayload {
  userId: string;
  userRole?: UserRole;
  iat?: number;
  exp?: number;
}
