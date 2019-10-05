import {EntityRepository, LessThan, Repository} from "typeorm";
import {Meal} from "./meals.entity";
import {GetmealsfilterDto} from "./dto/getmealsfilter.dto";
import {User} from "../users/user.entity";
import {CreatemealsDto} from "./dto/createmeals.dto";
import {UserRole} from "../users/dto/authCredentials.dto";

@EntityRepository(Meal)
export class MealsRepository extends Repository<Meal> {
    async getMeals(getMealsFiterDto: GetmealsfilterDto, user: User): Promise<Meal[]> {
        const {search} = getMealsFiterDto;
        const query = this.createQueryBuilder('meal');
        if (user.role !== UserRole.ADMIN) {
            query.where('meal.userId = :userId', {userId: user.id});
        }
        if(search) {
            query.andWhere('meal.description LIKE search', {search: `%${search}%`});
        }
        const meals = await query.getMany();
        return meals;
    }

    async createMeal(createMealsDto: CreatemealsDto, user: User): Promise<Meal> {
        const {description, calories, name} = createMealsDto;
        const meal = new Meal();
        meal.name = name;
        meal.Calories = calories;
        meal.description = description;
        meal.user = user;
        await meal.save();
        delete meal.user;
        return meal;
    }

}
