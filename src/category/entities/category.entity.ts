import {Column, Entity, Index, OneToOne, PrimaryColumn, Tree, TreeChildren, TreeParent} from "typeorm";
import {Menu} from "../../menu/entities/menu.entity";

@Entity()
@Tree("materialized-path")
export class Category {
    @OneToOne(() => Menu, (menu: Menu) => menu.category)
    menu: Menu;

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
