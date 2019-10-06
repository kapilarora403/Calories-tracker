import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post, Put,
    Query, UnauthorizedException,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {MealsService} from "./meals.service";
import {GetmealsfilterDto} from "./dto/getmealsfilter.dto";
import {GetUser} from "../users/getuser.decorator";
import {User} from "../users/user.entity";
import {Meal} from "./meals.entity";
import {CreatemealsDto} from "./dto/createmeals.dto";
import {UserRole} from "../users/dto/authCredentials.dto";
import {EditmealsDto} from "./dto/editmeals.dto";

@Controller('meals')
@UseGuards(AuthGuard())
export class MealsController {
    constructor(private mealService: MealsService) {}

    // @Get('/user')
    // getUsers(@GetUser() user: User) {
    //     console.log(user);
    //     if(user.role === UserRole.REGULAR) {
    //         throw new UnauthorizedException('haja');
    //     }
    //
    // }

    @Get()
    getMeals(@Query(ValidationPipe) filterDto: GetmealsfilterDto, @GetUser() user: User) {
        return this.mealService.getMeals(filterDto, user);
    }
    @Get('/:id')
    getMealsById(@Param('id', ParseIntPipe) id: number): Promise<Meal> {
        return this.mealService.getMealById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createMeal(@Body() createMealDto: CreatemealsDto, @GetUser() user: User) {
        return this.mealService.createMeal(createMealDto, user);
    }
    @Put('/edit/:id')
    @UsePipes(ValidationPipe)
    editMealsById(@Body() editMealDto: EditmealsDto, @GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.mealService.editMeal(editMealDto, user, id);
    }

    @Delete('/:id')
    deleteMealById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.mealService.deleteMealById(id, user);
    }


}
