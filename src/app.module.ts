import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketModule } from './websocket/websocket.module';
import { RoomModule } from './room/room.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [WebsocketModule, RoomModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule { }
