import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import appConfiguration from "./app-configuration";
import { appConfigValidationSchema } from "./app-config.schena";
import { AppConfigService } from "./app-config.service";


@Module({
    imports: [
        ConfigModule.forRoot({
            load: [appConfiguration], // carregar as nossas config
            validationSchema: appConfigValidationSchema,
        }),
    ],
    providers: [
        ConfigService, AppConfigService
    ],
    exports: [
        ConfigService, AppConfigService
    ],
})
export class AppConfigModule {}