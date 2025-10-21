import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { SmsModule } from 'src/services/sms/sms.module';
import { JwtStrategy } from 'src/controllers/auth/strategies';
import { TOKEN_EXPIRE } from 'src/blueprint';
import { AuthService } from './auth.service';

import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: TOKEN_EXPIRE * 60000 },
    }),
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
