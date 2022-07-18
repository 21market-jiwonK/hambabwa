import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsNumber} from "class-validator";

export class CreateRestaurantDto {
    @ApiProperty({
        description: '식당 이름',
        example: '오늘통닭'
    })
    public name: string;

    @ApiProperty({
        description: '상세',
        example: '이러저러하고 저러저러한 상세설명'
    })
    public detail: string;

    @ApiProperty({
        description: '주소',
        example: '서울특별시 서초구 서초대로74길 33'
    })
    public addr1: string;

    @ApiProperty({
        description: '주소 상세',
        example: '비트빌빌딩 1층'
    })
    public addr2: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '식당 대표사진'
    })
    public imageUrl: string;

    @ApiProperty({
        description: '점심 가격',
        example: 8000
    })
    public lunchPrice: number;

    @Transform(({ value }) => value.split(',').map(val => Number(val)))
    @IsNumber({}, {each: true})
    @ApiProperty({
        type: 'string',
        description: 'menu 고유 ids',
        example: '1,2,3,4,5',
        required: false,
    })
    public menuIds: number[];

    private lat: number;
    private lng: number;

    get getLat(): number {
        return this.lat;
    }

    set setLat(value: number) {
        this.lng = value;
    }

    get getLng(): number {
        return this.lng;
    }

    set setLng(value: number) {
        this.lng = value;
    }
}
