import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {JwtService} from "@nestjs/jwt";
import {AuthCredentialsDto} from "./dto/authCredentials.dto";
import {JwtPayload} from "./JwtPayload.interface";
import {User} from "./user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const email = await this.userRepository.signIn(authCredentialsDto);
        if(!email) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload: JwtPayload = {email};
        const accessToken = this.jwtService.sign(payload);
        return {accessToken};

    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users;
    }

    async deleteUserbyId(id: number) {
        const deletedUser = await this.userRepository.delete(id);
        return deletedUser;
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne(id);
        return user;
    }
}
