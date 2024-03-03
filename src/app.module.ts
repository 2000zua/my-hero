import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from 'nestjs-prisma';
import { HeroModule } from './moduls/hero/hero.module';
import { UserModule } from './moduls/user/user.module';

@Module({
  imports: [
    AuthModule, 
    HealthModule, 
    PrismaModule.forRoot({
      isGlobal: true
    }), HeroModule, UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
