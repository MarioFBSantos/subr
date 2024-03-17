import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('server.key'),
  //   cert: fs.readFileSync('server.cert'),
  // };

  // Configure o adaptador WebSocket , { httpsOptions }
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));

  // Configuração de CORS
  app.enableCors({
    origin: 'https://192.168.5.168:9090', // Substitua pelo endereço correto do seu aplicativo Vue.js
    methods: ['GET', 'POST'],
    credentials: true,
  });

  app.use((req, res, next) => {
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });

  const port = 9999; // A porta em que o servidor WebSocket vai ouvir
  await app.listen(port, '0.0.0.0');
  const address = await app.getUrl();
  console.log(`Servidor Nest.js está ouvindo na porta ${port} em ${address}`);
}

bootstrap();
