import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";
import DateTimeFormat = Intl.DateTimeFormat;
import {TimeInterval, Timestamp} from "rxjs";
import {timeInterval, timestamp} from "rxjs/operators";
import DateTimeFormatPart = Intl.DateTimeFormatPart;
import {type} from "os";

@Entity()
export class Meal extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    Calories: number;

    @Column()
    date: string;

    @Column()
    time: string;

    @ManyToOne(type => User, user => user.meals)
    user: User;

    @Column()
    userId: number;
}
