import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {JwtService} from "@nestjs/jwt";
import {AuthCredentialsDto} from "./dto/authCredentials.dto";
import {JwtPayload} from "./JwtPayload.interface";
import {User} from "./user.entity";
import {EditUserDto} from "./dto/editUser.dto";
import * as bcrypt from "bcryptjs";

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
        if(!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async editUserById(id: number, editUserDto: EditUserDto): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if(!user) {
            throw new NotFoundException('User not found');
        }
        const {email, password} = editUserDto;
        if(email) {
            user.email = email
        }
        if(password) {
            const hashedPass = await bcrypt.hash(password, 5);
            user.password = hashedPass;
        }
        await user.save();
        return user;

    }
}
