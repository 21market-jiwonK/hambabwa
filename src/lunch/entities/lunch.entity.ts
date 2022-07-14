import {Column, Entity, Index, JoinColumn, ManyToOne} from "typeorm";
import {BaseEntity} from "../../database/base-entity";
import {Restaurant} from "../../restaurant/entities/restaurant.entity";

@Entity()
export class Lunch extends BaseEntity {
    @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.lunchHistories)
    @JoinColumn()
    public restaurant: Restaurant;

    @Index({unique: true})
    @Column({
        type: 'date',
    })
    public servingDate: Date;
}
