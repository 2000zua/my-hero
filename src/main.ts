import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LogLevel, Logger, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config/app/app-config.service';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule  } from "@nestjs/swagger";

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const minimumLoggerLevels: LogLevel[] = ['log', 'error', 'warn'];
  const app = await NestFactory.create(AppModule, {
    logger: process.env.ENVIROMENT === 'prod' ? minimumLoggerLevels : minimumLoggerLevels.concat(['debug','verbose']),
  });

  const appConfig = app.get(AppConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Helmet helps secure Express apps by setting HTTP response headers.
  app.use(helmet({
    contentSecurityPolicy: appConfig.environment === 'localhost' ? false : undefined,
  }));

  if(appConfig.corsEnabled){
    app.enableCors();
  }
  
  if(appConfig.swaggerEnabled){
    const options = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription(appConfig.swaggerDescription)
    .setVersion(appConfig.swaggerVersion)
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(appConfig.swaggerPath, app, document);
  }

  const port = String(appConfig.port);
  await app.listen(port);
  logger.log(`Aplicacao iniciada na porta ${port} activo`);
}
bootstrap();
