import { Body, Controller, Post } from '@nestjs/common'; // Req, UseGuards
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCrendentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    @Post('/signup')
    signUp(@Body() userCreds: AuthCrendentialsDto): Promise<void> {
        return this.authService.signUp(userCreds);
    }

    @Post('/signin')
    signIn(@Body() userCreds: AuthCrendentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(userCreds);
    }

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@Req() req) {
    //     console.log(req);
    // }

}
