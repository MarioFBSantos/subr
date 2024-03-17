import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '383200035797-u474n33fle4bs2t6lkae6b344vjepikf.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:9999/websocket/callback',
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        return profile;
    }
}
