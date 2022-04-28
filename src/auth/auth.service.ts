import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCrendentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UsersRepository)
        private repo: UsersRepository,
        private jwtService: JwtService
    ) { }

    async signUp(userCreds: AuthCrendentialsDto): Promise<void> {
        return this.repo.createUser(userCreds);
    }

    async signIn(userCreds: AuthCrendentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = userCreds;
        const user = await this.repo.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(payload);

            return { accessToken };
        } else {
            throw new UnauthorizedException('Please check your login credentials.');
        }
    }
}
