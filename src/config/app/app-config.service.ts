import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AppConfigService {
    constructor(private configService: ConfigService){}

    get environment(): string {
        return this.configService.get<string>('app.environment');
    }

    get name(): string {
        return this.configService.get<string>('app.name');
    }

    get url(): string {
        return this.configService.get<string>('app.url');
    }

    get port(): string {
        return this.configService.get<string>('app.port');
    }

    get corsEnabled(): boolean {
        return this.configService.get<boolean>('app.corEnabled');
    }

    get jwtAccessSecret(): string {
        return this.configService.get<string>('app.jwtAccessSecret');
    }

    get jwtRefreshSecret() : string {
        return this.configService.get<string>('app.jwtRefreshSecret');
    }

    get jwtExpiresIn(): string {
        return this.configService.get<string>('app.jwtExpiresIn');
    }

    get jwtRefreshIn(): string {
        return this.configService.get<string>('app.jwtRefreshIn');
    }

    get bcryptSaltRounds(): number {
        return this.configService.get<number>('app.bcryptSaltRounds');
    }

    get grphqlPlaygroundEnabled(): boolean{
        return this.configService.get<boolean>('app.graphqlPlaygroundEnabled');
    }

    get grapqlDebug(): boolean {
        return this.configService.get<boolean>('app.graphqlDebug');
    }

    get graphqlSortSchema(): boolean {
        return this.configService.get<boolean>('app.graphqlSortSchema');
    }

    get graphqlSchemaDestination(): string {
        return this.configService.get<string>('app.graphqlSchemaDestination');
    }

    get swaggerEnabled(): boolean {
        return this.configService.get<boolean>('app.swaggerEnabled');
    }

    get swaggerDescription(): string {
        return this.configService.get<string>('app.swaggerDescription');
    }

    get swaggerVersion(): string {
        return this.configService.get<string>('app.swaggerVersion');
    }

    get swaggerPath(): string {
        return this.configService.get<string>('app.swaggerPath');
    }
    
}