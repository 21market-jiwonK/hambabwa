import {BaseEntity} from "../../database/base-entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from "typeorm";
import {Category} from "../../category/entities/category.entity";
import {Restaurant} from "../../restaurant/entities/restaurant.entity";

@Entity()
export class Menu extends BaseEntity {
    @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.menus)
    @JoinColumn()
    public restaurant: Restaurant;

    @OneToOne(() => Category, (category: Category) => category.menu)
    @JoinColumn()
    public category: Category;

    @Column({
        type: 'varchar',
        length: 25
    })
    public foodCode: string;

    @Column({
        type: 'varchar',
        length: 50
    })
    public foodTitle: string;

    @Column({
        type: 'varchar',
        length: 15
    })
    public calorie: string;

    @Column({
        type: 'varchar',
        length: 500
    })
    public imageUrl: string;

}
