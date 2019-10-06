import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MealsRepository} from "./meals.repository";
import {GetmealsfilterDto} from "./dto/getmealsfilter.dto";
import {User} from "../users/user.entity";
import {Meal} from "./meals.entity";
import {CreatemealsDto} from "./dto/createmeals.dto";
import {UserRole} from "../users/dto/authCredentials.dto";
import {EditmealsDto} from "./dto/editmeals.dto";

@Injectable()
export class MealsService {
    constructor(
        @InjectRepository(MealsRepository)
        private mealRepository: MealsRepository
    ) {}

    getMeals(filterDto: GetmealsfilterDto, user: User): Promise<Meal[]> {
        return this.mealRepository.getMeals(filterDto, user);
    }

    async getMealById(id: number): Promise<Meal> {
        const found = this.mealRepository.findOne({id});
        if(!found) {
            throw new NotFoundException('Meal not found')
        }
        return found;
    }

    async createMeal(createMealDto: CreatemealsDto, user: User): Promise<Meal> {
        return this.mealRepository.createMeal(createMealDto, user);
    }

    async editMeal(editMealDto: EditmealsDto, user: User, id: number) {
        return this.mealRepository.editMeal(id, editMealDto, user);
    }
    async deleteMealById(id: number, user: User): Promise<void> {
        const found = await this.mealRepository.findOne({id});
        if (found.userId !== user.id && user.role === UserRole.REGULAR) {
            throw new UnauthorizedException('Regular users cannot access other users meals')
        }
        const result = await this.mealRepository.delete({id});
        if(result.affected === 0) {
            throw new NotFoundException('Meal not found');
        }
    }
}
