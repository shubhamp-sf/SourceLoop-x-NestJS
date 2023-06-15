import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ApplicationConfig,
  AuthenticationServiceApplication,
} from '@sourceloop/authentication-service/dist/application';
import { juggler } from '@loopback/repository';

process.env.JWT_SECRET = 'secret';
process.env.JWT_ISSUER = 'sourcefuse';
process.env.USER_TEMP_PASSWORD = 'test123!@#';
global.authService = null;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ApplicationConfig = {
    rest: {
      listenOnStart: false,
    },
  };
  const authService = new AuthenticationServiceApplication(config);

  const authDb = new juggler.DataSource({
    name: 'AuthDB',
    connector: 'postgresql',
    host: 'localhost',
    port: '6000',
    user: 'postgres',
    password: 'super-secret',
    database: 'postgres',
    schema: 'main',
  });
  authService.dataSource(authDb);

  const authCache = new juggler.DataSource({
    name: 'AuthCache',
    connector: 'kv-memory',
  });
  authService.dataSource(authCache);

  await authService.boot();
  await authService.start();
  global.authService = authService;
  await app.listen(4000);
}
bootstrap();
