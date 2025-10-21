import { Name, User } from 'src/db/entities';
import { UserAuthStatus, UserRole, UserStatus } from 'src/typings';

/**
 * Maps to the reponse returned in jwt,stra
 */
interface RequestUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  nanoid: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  authStatus: UserAuthStatus;
  lastSeen: Date;
  signinCount: number;
  name: Name;
  refreshToken: number;
  activeLeague: number;
  authAttempts: number[];
  leagues: number[];
  draftPicks: number[];
}

/**
 * Sets the type of our user object that we assign using our jwt strategy onto the default
 * FastifyRequest object so we can correctly access this variable in our code
 *
 * @author jordanskomer
 * @since 0.0.1
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    isIntegrationUser?: boolean;
  }
}
