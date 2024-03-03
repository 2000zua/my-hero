import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/config/app/app-config.module';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from 'src/config/app/app-config.service';
import { JwtStrategy } from './jwt.strategy';
import { GraphqlAuthGuard } from './graphql-auth.guard';

@Module({
  imports:[
    AppConfigModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      useFactory: async (appConfig: AppConfigService) => ({
        secret: appConfig.jwtAccessSecret,
        signOptions: {
          expiresIn: appConfig.jwtExpiresIn,
        },
      }),
      inject: [AppConfigService],
      imports: [AppConfigModule]
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, GraphqlAuthGuard],
  exports: [ AuthService, GraphqlAuthGuard],
})
export class AuthModule {}
