import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "../../database/base-entity";
import {Restaurant} from "./restaurant.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Comment extends BaseEntity {
    @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.comments)
    @JoinColumn()
    public restaurant: Restaurant;

    @ManyToOne(() => User, (writer: User) => writer.comments)
    @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
    public writer: User;

    @Column('text')
    public comment: string;

    @Column('float')
    public stars: number;
}
