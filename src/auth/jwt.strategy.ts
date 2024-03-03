import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "./auth.service";
import { AppConfigService } from "src/config/app/app-config.service";
import { JwtDto } from "./dto/jwt.dto";
import { User } from "@prisma/client";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly authService: AuthService,
        private readonly appConfig: AppConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: appConfig.jwtAccessSecret,
        });
    }

    async validate(payload: JwtDto): Promise<User> {
        const user = await this.authService.getUser(payload.userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}