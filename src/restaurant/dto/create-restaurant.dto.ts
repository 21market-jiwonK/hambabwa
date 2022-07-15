import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsNumber} from "class-validator";

export class CreateRestaurantDto {
    @ApiProperty({
        description: '식당 이름',
        example: '오늘통닭'
    })
    private _name: string;

    @ApiProperty({
        description: '상세',
        example: '이러저러하고 저러저러한 상세설명'
    })
    private _detail: string;

    @ApiProperty({
        description: '주소',
        example: '서울특별시 서초구 서초대로74길 33'
    })
    private _addr1: string;

    @ApiProperty({
        description: '주소 상세',
        example: '비트빌빌딩 1층'
    })
    private _addr2: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '식당 대표사진'
    })
    private _imageUrl: string;

    @ApiProperty({
        description: '점심 가격',
        example: 8000
    })
    private _lunchPrice: number;

    @Transform(({ value }) => value.split(',').map(val => Number(val)))
    @IsNumber({}, {each: true})
    @ApiProperty({
        type: 'string',
        description: 'menu 고유 ids',
        example: '1,2,3,4,5',
        required: false,
    })
    private _menuIds: number[];

    private _lat: number;
    private _lng: number;

    get menuIds(): number[] {
        return this._menuIds;
    }

    set menuIds(value: number[]) {
        this._menuIds = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get detail(): string {
        return this._detail;
    }

    set detail(value: string) {
        this._detail = value;
    }

    get addr1(): string {
        return this._addr1;
    }

    set addr1(value: string) {
        this._addr1 = value;
    }

    get addr2(): string {
        return this._addr2;
    }

    set addr2(value: string) {
        this._addr2 = value;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    set imageUrl(value: string) {
        this._imageUrl = value;
    }

    get lunchPrice(): number {
        return this._lunchPrice;
    }

    set lunchPrice(value: number) {
        this._lunchPrice = value;
    }

    get lat(): number {
        return this._lat;
    }

    set lat(value: number) {
        this._lat = value;
    }

    get lng(): number {
        return this._lng;
    }

    set lng(value: number) {
        this._lng = value;
    }
}
