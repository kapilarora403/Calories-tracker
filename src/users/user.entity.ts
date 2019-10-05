import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Meal} from "../meals/meals.entity";
import {UserRole} from "./dto/authCredentials.dto";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: UserRole;

    @OneToMany(type => Meal, meal => meal.user)
    meals: Promise<User[]>;
}
