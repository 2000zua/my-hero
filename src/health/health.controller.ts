import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma-health.indicator';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private prismaHelthIndicator: PrismaHealthIndicator
    ){}

    @Get()
    @HealthCheck()
    check(){
        return this.health.check([() => this.prismaHelthIndicator.isHealthy('prisma')]);
    }
}
