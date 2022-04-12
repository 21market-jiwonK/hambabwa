import {Column, Entity, OneToMany} from "typeorm";
import {BaseEntity} from "../../database/base-entity";
import {Menu} from "../../menu/entities/menu.entity";

@Entity()
export class Restaurant extends BaseEntity {
    @OneToMany(() => Menu, (menu: Menu) => menu.restaurant)
    public menus: Menu[];

    @Column()
    public name: string;

    @Column()
    public detail: string;

    @Column()
    public addr1: string;

    @Column()
    public addr2: string;

    @Column({type: 'decimal', nullable: true})
    public lat: number;

    @Column({type: 'decimal', nullable: true})
    public lng: number;
}
