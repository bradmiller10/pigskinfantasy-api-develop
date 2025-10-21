import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { DateTime } from 'luxon';

import { ONETIMECODE_SMS_TEXT, REFRESH_TOKEN_EXPIRE, TOKEN_EXPIRE, VERIFICATION_CODE_LENGTH } from 'src/blueprint';
import { generateCode } from 'src/helpers/functions';
import { AuthErrorCode, UserAuthStatus } from 'src/typings';
import { AuthAttempt, RefreshToken, User } from 'src/db/entities';
import { SmsService } from 'src/services/sms/sms.service';
import { AuthException } from 'src/typings';
import { RepositoryService, InjectEntity } from 'src/services/respository';
import { Logger } from 'src/services/logger';

import { AuthDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectEntity(User)
    private usersRepository: RepositoryService<User>,
    @InjectEntity(RefreshToken)
    private refreshTokensRepository: RepositoryService<RefreshToken>,
    @InjectEntity(AuthAttempt)
    private authAttemptsRepository: RepositoryService<AuthAttempt>,
    private jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  async sendOneTimeCode(phoneNumber: string): Promise<AuthDto> {
    this.logger.verbose(`Ensures ${phoneNumber} is valid`);
    const user = await this.usersRepository.findOneBy('phoneNumber', phoneNumber);
    if (!user) throw new AuthException(AuthErrorCode.UserNotFound, `${phoneNumber} does not exist`);

    this.logger.verbose(`Generating one time code of ${VERIFICATION_CODE_LENGTH} length`);
    const oneTimeCode = generateCode(VERIFICATION_CODE_LENGTH);

    this.logger.log(`Sending code via sms to ${phoneNumber}`);
    await this.smsService.send(ONETIMECODE_SMS_TEXT(oneTimeCode), phoneNumber);

    this.logger.verbose('Setting one time code on user');
    await this.usersRepository.update(user.id, { oneTimeCode, authStatus: UserAuthStatus.Verifying });

    return {
      token: this.generateToken(user),
      code: process.env.ENV !== 'production' ? oneTimeCode : undefined,
    };
  }

  /**
   * Ensure the users encrypted password matches the passed in code.
   *
   * @returns {User}
   */
  async validateOneTimeCode(code: string, user: User): Promise<AuthDto> {
    this.logger.verbose(`Validating ${code} on ${user.nanoid}`);
    // await this.usersRepository.update(user.id, {
    //   authAttempts: await this.authAttemptsRepository.create({}),
    // })
    // Ensure we haven't already validated this session
    if (user.oneTimeCode === '') throw new AuthException(AuthErrorCode.InvalidCode, 'code has been used');

    // Ensure the code also matches the encrypted code we set on the user
    if (!(await compare(code, user.oneTimeCode)))
      throw new AuthException(AuthErrorCode.InvalidCode, 'code does not match');

    this.logger.verbose(`Clearing one time code from user ${user.id}`);

    const now = DateTime.now();

    // Clear password code since it has been validated and we only allow a one time validation
    await this.usersRepository.update(user.id, {
      oneTimeCode: '',
      authStatus: UserAuthStatus.LoggedIn,
      lastSeen: now.toJSDate(),
      refreshToken: await this.refreshTokensRepository.create({
        user,
        expiresAt: now.plus({ days: REFRESH_TOKEN_EXPIRE }),
      }),
    });

    return {
      token: this.generateToken(user, true),
    };
  }

  async refreshUsersToken(user: User) {
    if (user.refreshToken.expiresAt > new Date())
      throw new AuthException(AuthErrorCode.RefreshTokenExpired, 'refresh token has expired');

    this.logger.verbose('Updating users last seen time to now');
    await this.usersRepository.update(user.id, {
      lastSeen: new Date(),
    });

    this.logger.verbose('Generating new access token');

    return {
      token: this.generateToken(user, true),
    };
  }

  async logoutUser(user: User) {
    // Remove Refresh token and set status
    await this.usersRepository.update(user.id, {
      refreshToken: null,
      authStatus: UserAuthStatus.LoggedOut,
    });
  }

  /**
   * Generates the JWT token that will get set in our request.user object if the JWT token is successfully decoded
   * @param user
   * @param fullAccess
   * @returns
   */
  private generateToken(user: User, fullAccess?: boolean): string {
    this.logger.verbose(
      `Generating ${fullAccess ? 'full' : 'verification'} jwt token that will expire in ${TOKEN_EXPIRE} minutes`,
    );
    return this.jwtService.sign({
      userId: user.nanoid,
      userRole: fullAccess ? user.role : undefined,
    });
  }
}
