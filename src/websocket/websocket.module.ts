// websocket module
import { Module } from '@nestjs/common';
import { WebsocketController } from './websocket.controller';
import { WebsocketGateway } from './websocket.gateway';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';

@Module({
  controllers: [WebsocketController],
  exports: [],
  providers: [GoogleStrategy],
  imports: [PassportModule.register({ defaultStrategy: 'google' }),],
})
export class WebsocketModule { }
