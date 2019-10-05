import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {MealsRepository} from "./meals.repository";
import {GetmealsfilterDto} from "./dto/getmealsfilter.dto";
import {User} from "../users/user.entity";
import {Meal} from "./meals.entity";
import {CreatemealsDto} from "./dto/createmeals.dto";

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
    async deleteMealById(id: number): Promise<void> {
        const result = await this.mealRepository.delete({id});
        if(result.affected === 0) {
            throw new NotFoundException('Meal not found');
        }
    }
}
