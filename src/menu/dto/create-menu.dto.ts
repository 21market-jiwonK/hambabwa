import {Restaurant} from "../../restaurant/entities/restaurant.entity";
import {Category} from "../../category/entities/category.entity";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMenuDto {
    private _restaurant: Restaurant;
    private _category: Category;
    private _menuCategoryCode: string;

    @ApiProperty({
        description: 'category 고유 code',
        example: '050140000'
    })
    public categoryCode: string;

    @ApiProperty({
        description: '음식 코드',
        example: 'D212-027000000-0001'
    })
    public foodCode: string;

    @ApiProperty({
        description: '음식명',
        example: '국밥_돼지머리'
    })
    public foodTitle: string;

    @ApiProperty({
        description: '열량',
        example: '300Kcal'
    })
    public calorie: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '메뉴 대표사진'
    })
    public imageUrl: string;

    @ApiProperty({
        description: 'Y - 카테고리 대표메뉴, N - default',
        example: 'N'
    })
    public isRepresentative: string;

    get restaurant(): Restaurant {
        return this._restaurant;
    }

    set restaurant(restaurant: Restaurant) {
        this._restaurant = restaurant;
    }

    get category(): Category {
        return this._category;
    }

    set category(category: Category) {
        this._category = category;
    }

    get menuCategoryCode(): string {
        return this._menuCategoryCode;
    }

    set menuCategoryCode(code: string) {
        this._menuCategoryCode = code;
    }
}
