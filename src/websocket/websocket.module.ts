// websocket module
import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  controllers: [WebsocketController],
  exports: [],
  providers: [],
  imports: [WebsocketGateway],
})
export class WebsocketModule { }
