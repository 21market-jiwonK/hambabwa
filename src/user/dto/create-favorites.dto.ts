import {Menu} from "../../menu/entities/menu.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {User} from "../entities/user.entity";

export class CreateFavoritesDto {
    private _favorites: Menu[];
    private _user: User;

    @Transform(({ value }) => value.split(',').map(val => Number(val)))
    @ApiProperty({
        description: 'menu 고유 id',
        example: "1,2,3,4",
    })
    public menuIds: number[];

    set favorites(menus: Menu[]) {
        this._favorites = menus;
    }

    get favorites(): Menu[] {
        return this._favorites;
    }

    set user(user: User) {
        this._user = user;
    }

    get user() {
        return this._user;
    }
}