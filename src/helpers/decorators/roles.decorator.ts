import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/typings/enums';

export const ROLES_KEY = 'roles';

const OwnerRoles: UserRole[] = [UserRole.Owner];
const LeagueOwnerRoles: UserRole[] = [...OwnerRoles, UserRole.LeagueOwner];
const UserRoles: UserRole[] = [...LeagueOwnerRoles, UserRole.User];

/**
 * Only allow user's with roles Admin, Owner or Employee into the route this is attached on
 * @usage @Employees()
 * @author jordanskomer
 * @since 0.0.1
 */
export const LeagueOwners = () => SetMetadata(ROLES_KEY, LeagueOwnerRoles);

/**
 * Only allow user's with roles Admin or Owner into the route this is attached on
 * @usage @Admins()
 * @author jordanskomer
 * @since 0.0.1
 */
export const Owners = () => SetMetadata(ROLES_KEY, OwnerRoles);

export const Admins = () => SetMetadata(ROLES_KEY, OwnerRoles);

/**
 * Only allow owner user's into the route this is attached on
 * @usage @Users()
 * @author jordanskomer
 * @since 0.0.1
 */
export const Users = () => SetMetadata(ROLES_KEY, UserRoles);

export const Roles = (roles: UserRole | UserRole[]) =>
  SetMetadata(ROLES_KEY, Array.isArray(roles) ? (roles as UserRole[]) : [roles]);
