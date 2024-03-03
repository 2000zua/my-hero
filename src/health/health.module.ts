import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from "@nestjs/axios";
import { PrismaHealthIndicator } from './prisma-health.indicator';

@Module({
  imports: [
    TerminusModule, HttpModule
  ],
  controllers: [HealthController],
  providers: [
    PrismaHealthIndicator
  ],
})
export class HealthModule {}
