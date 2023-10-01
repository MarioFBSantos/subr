import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketModule } from './websocket/websocket.module';
import { RoomModule } from './room/room.module';


@Module({
  imports: [WebsocketModule, RoomModule],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule { }
