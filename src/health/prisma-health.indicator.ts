import { Injectable } from "@nestjs/common";
import { HealthIndicator, HealthCheckError, HealthIndicatorResult } from "@nestjs/terminus";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
    constructor(private readonly prismaService: PrismaService){
        super();
    }

    async isHealthy(key: string): Promise<HealthIndicatorResult>{
        try {
            await this.prismaService.$queryRaw`SELECT 1`;
            return this.getStatus(key, true);
        } catch (e) {
            throw new HealthCheckError('Prisa check failed: ', e);
        }
    }
}