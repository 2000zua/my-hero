import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from 'nestjs-prisma';
import { HeroModule } from './moduls/hero/hero.module';
import { UserModule } from './moduls/user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { AppConfigService } from './config/app/app-config.service';
import { AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { GraphQLError } from 'graphql';
import { AppConfigModule } from './config/app/app-config.module';
import { SharedModule } from './shared/shared.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    HealthModule,
    AppConfigModule,/*
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: 'C:\\Users\\Gildo\\Music\\my-hero\\src\\i18n',//path.join(__dirname, '/i18n/'),
      },
      resolvers: [
        new QueryResolver(['lang']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
    }),*/
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (appConfig: AppConfigService) => ({
        installSubscriptionHandlers: true,
        buildSchemaOptions: {
          numberScalarMode: 'integer',
        },
        sortSchema: appConfig.graphqlSortSchema,
        autoSchemaFile: appConfig.graphqlSchemaDestination,
        debug: appConfig.grapqlDebug,
        playground: appConfig.grphqlPlaygroundEnabled,
        context: ({ req }) => ({ req, user: req.user }),
        formatError: (error: GraphQLError) => {
          //const exception = error.extensions?.exception?.response;
          const logger = new Logger('GraphQLError');
          logger.error(JSON.stringify(error));
          return error;
          /*
          return {
            message: exception?.message || error.message || 'INTERNAL_SERVER_ERROR',
            code: exception?.code || error.extensions?.response?.statusCode || 500,
            data: exception?.data || {},
            info: exception?.code || error.extensions?.response?.message || '',
          };*/
        },
      }),
      inject: [AppConfigService],
      imports: [AppConfigModule],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
    AuthModule,
    UserModule,
    HeroModule,
  ],
  providers: [],
})
export class AppModule {}
