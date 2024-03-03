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
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HealthModule,
    AppConfigModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: 'src/i18n/',//path.join(__dirname, '/i18n/'),
      },
      resolvers: [
        new QueryResolver(['lang']),
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        AcceptLanguageResolver,
      ],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (appConfig: AppConfigService) => ({
        // Configuração do driver Apollo e opções globais do GraphQL
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        installSubscriptionHandlers: true,
        buildSchemaOptions: {
          numberScalarMode: 'integer',
          // Sorteia automaticamente os tipos no esquema (configurável via appConfig.graphqlSortSchema)
          sortSchema: appConfig.graphqlSortSchema || true,
        },
        debug: appConfig.grapqlDebug || false,
        playground: appConfig.grphqlPlaygroundEnabled || true,
        context: ({ req }) => ({ req, user: req.user }), // Adicione informações do usuário ao contexto
        formatError: (error: GraphQLError) => {
          const logger = new Logger('GraphQLError');
          logger.error(JSON.stringify(error));

          return error;
    
          // Melhora a resposta de erro para os clientes
          /* return {
            message: error.message || 'Internal server error',
            code: error.extensions?.response.statusCode || 500,
            data: error.extensions?.exception?.data || {},
            info: error.extensions?.exception?.response?.message || '',
          };*/
        },
      }),
      inject: [AppConfigService], // Injeta o serviço de configuração
      imports: [AppConfigModule, ConfigModule], // Importa o módulo de configuração se necessário
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
