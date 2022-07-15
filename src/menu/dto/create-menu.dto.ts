import {Restaurant} from "../../restaurant/entities/restaurant.entity";
import {Category} from "../../category/entities/category.entity";
import {ApiProperty} from "@nestjs/swagger";

export class CreateMenuDto {
    private _restaurant: Restaurant;
    private _category: Category;

    @ApiProperty({
        description: '음식 코드',
        example: 'D212-027000000-0001'
    })
    private _foodCode: string;

    @ApiProperty({
        description: '음식명',
        example: '국밥_돼지머리'
    })
    private _foodTitle: string;

    @ApiProperty({
        description: '열량',
        example: '300Kcal'
    })
    private _calorie: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '메뉴 대표사진'
    })
    private _imageUrl: string;

    get restaurant(): Restaurant {
        return this._restaurant;
    }

    set restaurant(value: Restaurant) {
        this._restaurant = value;
    }

    get category(): Category {
        return this._category;
    }

    set category(value: Category) {
        this._category = value;
    }

    get foodCode(): string {
        return this._foodCode;
    }

    set foodCode(value: string) {
        this._foodCode = value;
    }

    get foodTitle(): string {
        return this._foodTitle;
    }

    set foodTitle(value: string) {
        this._foodTitle = value;
    }

    get calorie(): string {
        return this._calorie;
    }

    set calorie(value: string) {
        this._calorie = value;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    set imageUrl(value: string) {
        this._imageUrl = value;
    }
}
