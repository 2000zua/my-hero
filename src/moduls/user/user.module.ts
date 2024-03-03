import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AppConfigModule, AuthModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
