import {Column, JoinColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {DietType} from "../diet.type.enum";
import {Restaurant} from "../../restaurant/entities/restaurant.entity";

@Entity()
export class Menu {

    @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.menus, { primary: true })
    @JoinColumn()
    public restaurant: Restaurant;

    @PrimaryColumn('date')
    public servingDate: Date;

    @PrimaryColumn({ type: "enum", enum: DietType })
    public dietType: DietType;

    @Column()
    public title: string;

    @Column({ nullable: true })
    public detail: string;

    @Column({ nullable: true })
    public image1: string;

    @Column({ nullable: true })
    public image2: string;

    @Column({ nullable: true })
    public image3: string;

    @Column({ nullable: true })
    public image4: string;
}
