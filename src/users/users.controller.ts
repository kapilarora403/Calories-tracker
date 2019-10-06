import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UnauthorizedException,
    UseGuards,
    ValidationPipe
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {AuthCredentialsDto, UserRole} from "./dto/authCredentials.dto";
import {UserRoleValidationPipe} from "./pipes/userrole.pipe";
import {User} from "./user.entity";
import {GetUser} from "./getuser.decorator";
import {AuthGuard} from "@nestjs/passport";
import {EditUserDto} from "./dto/editUser.dto";

@Controller('users')
export class UsersController {
    constructor(private userServices: UsersService) {}
    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        return this.userServices.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
        return this.userServices.signIn(authCredentialsDto);
    }
    @Put('/editRole/:id')
    @UseGuards(AuthGuard())
    async updateUserRole(@Body('role', UserRoleValidationPipe) role: UserRole, @GetUser() user: User,
                         @Param('id', ParseIntPipe) id: number) {
        if(user.role === UserRole.REGULAR || user.role === UserRole.USER_MANAGER) {
            throw new UnauthorizedException('Regular users are not allowed to see this page');
        }
        const foundUser = await this.userServices.getUserById(id);
        foundUser.role = role;
        await foundUser.save();
        delete foundUser.password;
        delete foundUser.id;
        return foundUser;
    }

    @Put('/edit/:id')
    @UseGuards(AuthGuard())
    async editUsers(@Param('id', ParseIntPipe) id: number, @GetUser() user: User,
                    @Body() editUserDto: EditUserDto) {
        if(user.role === UserRole.REGULAR) {
            throw new UnauthorizedException('Regular users are not allowed to see this page')
        }
        return this.userServices.editUserById(id, editUserDto);
    }

    @Get()
    @UseGuards(AuthGuard())
    getAllUsers(@GetUser() user: User) {
        if(user.role === UserRole.REGULAR) {
            throw new UnauthorizedException('Regular users are not allowed to see this page')
        }
        return this.userServices.getAllUsers();
    }

    @Delete('/:id')
    @UseGuards(AuthGuard())
    deleteUser(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
        if(user.role === UserRole.REGULAR) {
            throw new UnauthorizedException('Regular users are not allowed to see this page')
        }
        return this.userServices.deleteUserbyId(id)
    }

}
