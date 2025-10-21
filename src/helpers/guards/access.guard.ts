import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { ROLES_KEY } from 'src/helpers/decorators';
import { AuthErrorCode, UserRole } from 'src/typings/enums';
import { AuthException } from 'src/typings/exceptions/auth-error.exception';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Checks if the @Roles is set on the route and if so it ensures the autheticated user's role matches
   * the allowed roles for that route
   * @param context
   * @returns
   */
  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]))
      return true;

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user, isIntegrationUser } = context.switchToHttp().getRequest() as FastifyRequest;

    // Allow integration user access to all
    if (isIntegrationUser) return true;

    // Ensure user's role matches the required permissions
    if (!requiredRoles || !requiredRoles.includes(user.role))
      throw new AuthException(AuthErrorCode.PermissionDenied, `you do not have permission to access this resource`);

    return true;
  }
}
