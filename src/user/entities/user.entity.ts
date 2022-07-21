import { Exclude } from "class-transformer";
import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../database/base-entity";

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, type: "varchar", length: 50 })
  public email: string;

  @Column({ type: "varchar", length: 20 })
  public nickname: string;

  @Column({ type: "varchar", length: 80 })
  public password: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;
}
