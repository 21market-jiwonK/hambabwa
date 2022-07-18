import {Column, Entity, Index, OneToMany, PrimaryColumn, Tree, TreeChildren, TreeParent} from "typeorm";
import {Menu} from "../../menu/entities/menu.entity";

@Entity()
@Tree("materialized-path")
export class Category {
    @OneToMany(() => Menu, (menus: Menu) => menus.category)
    menus: Menu[];

    @PrimaryColumn('varchar', {length: 20})
    @Index({ unique: true })
    code: string;

    @Column({ type: 'varchar', length: 80 })
    title: string;

    @TreeChildren({
        cascade: true,
    })
    children: Category[];

    @TreeParent()
    parent: Category;
}
