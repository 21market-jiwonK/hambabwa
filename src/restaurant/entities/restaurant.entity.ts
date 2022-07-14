import {Column, Entity, OneToMany} from "typeorm";
import {BaseEntity} from "../../database/base-entity";
import {Lunch} from "../../lunch/entities/lunch.entity";

@Entity()
export class Restaurant extends BaseEntity {
    @OneToMany(() => Lunch, (lunch: Lunch) => lunch.restaurant)
    public lunchHistories: Lunch[];

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
}
