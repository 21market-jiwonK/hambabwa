import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "../../database/base-entity";
import {Restaurant} from "./restaurant.entity";

@Entity()
export class Comment extends BaseEntity {
    @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.comments)
    @JoinColumn()
    public restaurant: Restaurant;

    @Column('text')
    public comment: string;

    @Column('float')
    public stars: number;
}
