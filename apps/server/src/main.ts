import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import * as helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const whitelist = ['https://react-socket-io-webrtc-client.herokuapp.com/'];

  const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false }; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
  };

  app.use(cors(corsOptionsDelegate));
  app.use(helmet());

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
