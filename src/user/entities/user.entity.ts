import { OmitType } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { UserRole } from "src/common/enums/user.role.enum";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "../../database/base-entity";
import { Menu } from "../../menu/entities/menu.entity";
import { Comment } from "../../restaurant/entities/comment.entity";

@Entity()
export class User extends BaseEntity {
  @ManyToMany(() => Menu, (menus: Menu) => menus.users, {
    cascade: true,
    onUpdate: "CASCADE",
  })
  @JoinTable()
  public favorites: Menu[];

  @OneToMany(() => Comment, (comment: Comment) => comment.writer)
  public comments: Comment[];

  @Column({ unique: true, type: "varchar", length: 50 })
  public email: string;

  @Column({ type: "varchar", length: 20 })
  public nickname: string;

  @Column({ type: "varchar", length: 80 })
  @Exclude()
  public password: string;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @Column({ type: "enum", enum: UserRole })
  public role: UserRole;

  @Column({
    default: 'https://image.hambabwa.kr/dev/profile/default.png',
  })
  public imageUrl: string;
}

export class ReadOnlyUserData extends OmitType(User, ["password"] as const) {}

export type Payload = {
  email: string;
  sub: number;
};

export interface RequestWithUser extends Request {
  user: User;
}
