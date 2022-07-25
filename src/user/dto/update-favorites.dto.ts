import {ApiProperty, PickType} from "@nestjs/swagger";
import {CreateFavoritesDto} from "./create-favorites.dto";
import {ToggleType} from "../../common/enums/toggle.type.enum";

export class UpdateFavoritesDto extends PickType(CreateFavoritesDto, ['user'] as const) {
    private _menuId: number;

    @ApiProperty({
        type: 'enum',
        enum: ToggleType,
        example: ToggleType.OFF
    })
    type: ToggleType;

    set menuId(id: number) {
        this._menuId = id;
    }

    get menuId(): number {
        return this._menuId;
    }
}