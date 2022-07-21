import {BaseEntity} from "../../database/base-entity";
import {BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne} from "typeorm";
import {Category} from "../../category/entities/category.entity";
import {Restaurant} from "../../restaurant/entities/restaurant.entity";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Menu extends BaseEntity {
    @ManyToMany(() => Restaurant, (restaurants: Restaurant) => restaurants.menus)
    public restaurants: Restaurant[];

    @ManyToOne(() => Category, (category: Category) => category.menus)
    @JoinColumn()
    public category: Category;

    @ManyToMany(() => User, (users: User) => users.favorites)
    public users: User[];

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
        nullable: true,
        default: null,
        type: 'varchar',
        length: 500
    })
    public imageUrl: string;

    @Column({
        type: 'char',
        default: 'N'
    })
    public isRepresentative: string;

    @Column({
        type: 'varchar',
        length: 2
    })
    public menuCategoryCode: string;

    @BeforeInsert()
    setMenuCategoryCode() {
        this.menuCategoryCode = this.category.menuCategoryCode;
    }
}
