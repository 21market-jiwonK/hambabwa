import {PickType} from "@nestjs/swagger";
import {CreateFavoritesDto} from "./create-favorites.dto";

export class UpdateFavoritesDto extends PickType(CreateFavoritesDto, ['user'] as const) {
    private _menuId: number;

    set menuId(id: number) {
        this._menuId = id;
    }

    get menuId(): number {
        return this._menuId;
    }
}