import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { FastifyRequest } from 'fastify';
import { DateTime } from 'luxon';
import { AuthErrorCode, JwtPayload, AuthException, UserAuthStatus } from 'src/typings';
import { User } from 'src/db/entities';
import { Logger } from 'src/services/logger';
import { InjectEntity, RepositoryService } from 'src/services/respository';

const BEARER_PADDING_STRING = 'Bearer ';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'custom') {
  private accessPath: string;
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private jwtService: JwtService, @InjectEntity(User) private usersRepository: RepositoryService<User>) {
    super();
  }
  /**
   * Since the JWT is already verified and decoded in the passport-jwt strategy all we need to do here is return
   * the payload of the token.
   *
   * @note If we ever need to handle revoking users than more than just having a valid JWT token this is where we would do that
   * @param payload
   * @returns {JwtPayload}
   * @author jordanskomer
   */
  async validate(req: FastifyRequest) {
    const token = this.extractTokenFromRequest(req);
    const payload = this.extractPayloadFromToken(token);
    this.logger.verbose(`Verifying user has proper access from JWT payload`, payload);
    return await this.retrieveUser(payload.userId);
  }

  private async retrieveUser(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne(userId);

    if (user.refreshToken && user.refreshToken.isRevoked)
      throw new AuthException(AuthErrorCode.AccessRevoked, `access is revoked`);

    if (user.authStatus === UserAuthStatus.LockedOut)
      throw new AuthException(AuthErrorCode.UserLockedOut, 'user is locked out');

    this.logger.verbose(' Access is valid');

    return user;
  }

  private validatePayload(payload: JwtPayload) {
    if (this.accessPath === '/auth/verify' && payload.userRole)
      throw new AuthException(AuthErrorCode.InvalidAccessToken, `invalid bearer token. must be one time access token`);

    if (this.accessPath !== '/auth/verify' && typeof payload.userRole === 'undefined')
      throw new AuthException(AuthErrorCode.InvalidAccessToken, `invalid bearer token. must be full access token`);

    if (this.accessPath !== '/auth/refresh' && this.isTimeExpired(payload.exp))
      throw new AuthException(AuthErrorCode.AccessTokenExpired, `access token has expired`);

    return payload;
  }

  private extractTokenFromRequest(req: FastifyRequest): string {
    if (!req.headers.authorization) throw new AuthException(AuthErrorCode.InvalidAccessToken, `missing bearer token`);

    if (!req.headers.authorization.startsWith(BEARER_PADDING_STRING))
      throw new AuthException(AuthErrorCode.InvalidAccessToken, `invalid bearer token`);

    this.accessPath = req.routerPath;

    return req.headers.authorization.substr(BEARER_PADDING_STRING.length);
  }

  /**
   * Verifies the passed in token and will extract the payload if everything is valid. Otherwise it will throw a error
   *
   * @param token - A JWT Token
   * @returns {JwtPayload} - The passed in token's contents
   * @author jordanskomer
   * @since 0.0.1
   */
  private extractPayloadFromToken(token: string): JwtPayload {
    return this.validatePayload(this.jwtService.verify(token));
  }

  /**
   * Checks if the passed in seconds are in the past or not
   *
   * @param expInSeconds - The amount of seconds to compare to the current amount of seconds
   * @returns True if the passed in time is in the past, false if not
   * @author jordanskomer
   * @since 0.0.1
   */
  private isTimeExpired(expInSeconds: number): boolean {
    return expInSeconds < DateTime.now().toSeconds();
  }
}
