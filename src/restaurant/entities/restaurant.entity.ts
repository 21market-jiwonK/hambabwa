import {Column, Entity} from "typeorm";
import {BaseEntity} from "../../database/base-entity";

@Entity()
export class Restaurant extends BaseEntity {
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
