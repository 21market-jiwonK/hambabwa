import {BaseEntity} from "../../database/base-entity";
import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {Category} from "../../category/entities/category.entity";

@Entity()
export class Menu extends BaseEntity {
    @Column()
    public foodCode: string;

    @Column()
    public foodTitle: string;

    @OneToOne(() => Category, (category: Category) => category.menu)
    @JoinColumn()
    public category: Category;

}
