import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';
import {Transform} from "class-transformer";
import {IsNumber} from "class-validator";

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
    @Transform(({ value }) => value.split(',').map(val => Number(val)))
    @IsNumber({}, {each: true})
    @ApiProperty({
        description: 'menu 고유 ids',
        example: '1,2,3,4,5'
    })
    private _menuIds: number[];


    get menuIds(): number[] {
        return this._menuIds;
    }

    set menuIds(value: number[]) {
        this._menuIds = value;
    }
}
