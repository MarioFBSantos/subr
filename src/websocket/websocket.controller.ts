import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('websocket')
export class WebsocketController {
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req) {
        return req.user;
    }
}
