import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCrendentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UsersRepository)
        private repo: UsersRepository
    ) { }

    async signUp(userCreds: AuthCrendentialsDto): Promise<void> {
        return this.repo.createUser(userCreds);
    }

    async signIn(userCreds: AuthCrendentialsDto): Promise<string> {
        const { username, password } = userCreds;
        const user = await this.repo.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            return 'success';
        } else {
            throw new UnauthorizedException('Please check your login credentials.');
        }
    }
}
