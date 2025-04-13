import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/domain/users/users.module';
import { SessionModule } from 'src/domain/session/session.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { MailsModule } from 'src/domain/mails/mails.module';
import { ForgotPasswordModule } from 'src/domain/forgot-password/forgot-password.module';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    MailsModule,
    PassportModule,
    ForgotPasswordModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtRefreshStrategy,
    JwtStrategy,
    AnonymousStrategy,
  ],
  exports: [
    AuthService,
  ],
})
export class AuthModule {}