import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtGuard extends AuthGuard('custom') {
  constructor(private ref: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (this.canOverride(context)) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * Determines if the current context should be allowed to override our JWT authentication strategy or not.
   *
   * @param context
   * @returns {boolean} True if the crent context should override and skip JWT authentication
   * @author jordanskomer
   * @since 0.0.1
   */
  private canOverride(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as FastifyRequest;
    return this.isPublic(context.getHandler(), context.getClass()) || this.isIntegrationUser(req);
  }

  /**
   * Determines if someone is using the @isPublic() auth guard on their route. If so we should just allow
   * access to the request since it is defined as a public route and requires no user authentication
   *
   * @author jordanskomer
   * @since 0.0.1
   * @returns {boolean} Whether the route is declared as public or not
   */
  private isPublic(handler, className): boolean {
    return this.ref.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, className]);
  }

  private isIntegrationUser(req: FastifyRequest): boolean {
    if (req.headers.authorization === `Bearer ${process.env.CI_BEARER_TOKEN}`) {
      // Set the user object to our Integration User
      req.isIntegrationUser = true;
      return true;
    }

    return false;
  }
}
