import { Exclude } from "class-transformer";
import {Column, Entity, JoinTable, ManyToMany, OneToMany} from "typeorm";
import { BaseEntity } from "../../database/base-entity";
import {Menu} from "../../menu/entities/menu.entity";
import {Comment} from "../../restaurant/entities/comment.entity";

@Entity()
export class User extends BaseEntity {
  @ManyToMany(() => Menu, (menus: Menu) => menus.users)
  @JoinTable()
  public favorites: Menu[];

  @OneToMany(() => Comment, (comment: Comment) => comment.writer)
  public comments: Comment[];

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
