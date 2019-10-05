import {EntityRepository, Repository} from "typeorm";
import {User} from "./user.entity";
import {AuthCredentialsDto, UserRole} from "./dto/authCredentials.dto";
import * as bcrypt from "bcryptjs";
import {ConflictException, InternalServerErrorException, UnauthorizedException} from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {email, password} = authCredentialsDto;
        const user = new User();
        const hashedPass = await bcrypt.hash(password, 5);
        user.email = email;
        user.password = hashedPass;
        user.role = UserRole.REGULAR;
        try {
            await user.save()
        } catch(e) {
            if (e.code === '23505') {
                throw new ConflictException('email already exists');
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const {email, password} = authCredentialsDto
        const user = await this.findOne({email});
        if(user) {
            const doMatch = await bcrypt.compare(password, user.password);
            if(doMatch) {
                return user.email;
            } else {
                throw new UnauthorizedException('Invalid credentials');
            }
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

}
