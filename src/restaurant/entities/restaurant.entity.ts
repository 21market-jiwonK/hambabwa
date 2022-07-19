import {Column, Entity, JoinTable, ManyToMany, OneToMany} from "typeorm";
import {BaseEntity} from "../../database/base-entity";
import {Menu} from "../../menu/entities/menu.entity";
import {Comment} from "./comment.entity";

@Entity()
export class Restaurant extends BaseEntity {
    @ManyToMany(() => Menu, (menus: Menu) => menus.restaurants, {
        cascade: true
    })
    @JoinTable({name: 'restaurants_menus'})
    public menus: Menu[];

    @OneToMany(() => Comment, (comments: Comment) => comments.restaurant)
    public comments: Comment[];

    @Column('float', {
        default: null,
        nullable: true
    })
    public stars: number;

    @Column()
    public name: string;

    @Column('text')
    public detail: string;

    @Column()
    public addr1: string;

    @Column()
    public addr2: string;

    @Column({type: 'double', nullable: true})
    public lat: number;

    @Column({type: 'double', nullable: true})
    public lng: number;

    @Column({nullable: true})
    public imageUrl: string;

    @Column()
    public lunchPrice: number;
}
