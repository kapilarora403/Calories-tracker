import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "./user.repository";
import {User} from "./user.entity";
import {MealsModule} from "../meals/meals.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), TypeOrmModule, JwtModule.register({
    secret: 'topSecret51',
    signOptions: {
      expiresIn: 3600
    }
  }), PassportModule.register({defaultStrategy: 'jwt'})],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
