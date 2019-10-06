import {Between, EntityRepository, LessThan, MoreThan, MoreThanOrEqual, Repository} from "typeorm";
import {Meal} from "./meals.entity";
import {GetmealsfilterDto} from "./dto/getmealsfilter.dto";
import {User} from "../users/user.entity";
import {CreatemealsDto} from "./dto/createmeals.dto";
import {UserRole} from "../users/dto/authCredentials.dto";
import * as moment from "moment";
import {BadRequestException, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {EditmealsDto} from "./dto/editmeals.dto";
import {split} from "ts-node";

@EntityRepository(Meal)
export class MealsRepository extends Repository<Meal> {
    async getMeals(getMealsFiterDto: GetmealsfilterDto, user: User): Promise<Meal[]> {
        const {fromDate, toDate, fromTime, toTime} = getMealsFiterDto;
        let found = await this.find();
        if (user.role !== UserRole.ADMIN) {
                 found = found.filter(meal => {
                     if (meal.userId === user.id) {
                         return meal;
                     }
                 })
             }
        if(fromDate) {
            found = found.filter(meal => {
                let date = parseInt(meal.date.split('-')[0]);
                let month = parseInt(meal.date.split('-')[1]);
                if(date >= moment(fromDate, 'DD-MM-YYYY').date() && month >= moment(fromDate, 'DD-MM-YYYY').month() + 1) {
                    return meal
                }
            })

        }
        if(toDate) {
            found = found.filter(meal => {
                let date = parseInt(meal.date.split('-')[0]);
                let month = parseInt(meal.date.split('-')[1]);
                if(date <= moment(toDate, 'DD-MM-YYYY').date() && month <= moment(toDate, 'DD-MM-YYYY').month() + 1) {
                    return meal
                }
            })
        }
        if(fromTime) {
            found = found.filter(meal => {
                let hours = parseInt(meal.time.split(':')[0]);
                let minutes = parseInt(meal.time.split(':')[1]);
                if(hours >= moment(fromTime, 'hh:mm').hour() && minutes >= moment(fromTime, 'hh:mm').minutes()) {
                    return meal
                }
            })
        }
        if(toTime) {
            found = found.filter(meal => {
                let hours = parseInt(meal.time.split(':')[0]);
                let minutes = parseInt(meal.time.split(':')[1]);
                if(hours <= moment(toTime, 'hh:mm').hour() && minutes <= moment(toTime, 'hh:mm').minutes()) {
                    return meal
                }
            })
        }
        return found;
        // const query = this.createQueryBuilder('meal');
        // if (user.role !== UserRole.ADMIN) {
        //     query.where('meal.userId = :userId', {userId: user.id});
        // }
        //
        // const meals = await query.getMany();
        // return meals;
    }

    async createMeal(createMealsDto: CreatemealsDto, user: User): Promise<Meal> {
        const {date, time, calories, name} = createMealsDto;
        const validDate = moment(date + time, 'DD-MM-YYYY hh:mm').isValid();
        if(!validDate) {
            throw new BadRequestException('Invalid date or time');
        }
        const meal = new Meal();
        meal.name = name;
        meal.Calories = calories;
        meal.date = date;
        meal.time = time;
        meal.user = user;
        await meal.save();
        delete meal.user;
        return meal;
    }

    async editMeal(id: number, editMealDto: EditmealsDto, user: User): Promise<Meal> {
        const {date, time, calories, name} = editMealDto;
        const meal = await this.findOne({id});
        if(!meal) {
            throw new NotFoundException('meal not found')
        }
        if (meal.userId !== user.id && user.role === UserRole.REGULAR) {
            throw new UnauthorizedException('Regular users cannot access other users meal');
        }
        if(date) {
            const isValid = moment(date, 'DD-MM-YYYY').isValid();
            if(!isValid) {
                throw new BadRequestException('Date is invalid')
            }
            meal.date = date
        }
        if(time) {
            const isValid = moment(time, 'hh:mm').isValid();
            if(!isValid) {
                throw new BadRequestException('Time is invalid')
            }
            meal.time = time
        }
        if(calories) {
            meal.Calories = calories
        }
        if(name) {
            meal.name = name
        }
        await meal.save();
        return meal;
    }

}
