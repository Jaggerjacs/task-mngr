import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCrendentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {

    async createUser(userCreds: AuthCrendentialsDto): Promise<void> {
        const { username, password } = userCreds;
        // hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.create({
            username, password: hashedPassword
        });
        try {
            await this.save(user);
        } catch (error) {
            // console.log(error.code); // ER_DUP_ENTRY - from MySQL
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException('Username already exists.');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}