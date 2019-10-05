import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MealsRepository} from "./meals.repository";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([MealsRepository]), TypeOrmModule, UsersModule],
  controllers: [MealsController],
  providers: [MealsService]
})
export class MealsModule {}
