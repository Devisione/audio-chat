import { Module } from '@nestjs/common';
import { MessageGateway } from './gateways/message.gateway';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'), // <-- path to the static files
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
  ],
  controllers: [],
  providers: [MessageGateway],
})
export class AppModule {}
