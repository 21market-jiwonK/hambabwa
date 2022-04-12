import {ApiProperty} from "@nestjs/swagger";
import {DietType} from "../diet.type.enum";
import {Transform} from "class-transformer";
import {IsNotEmpty} from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty()
    @ApiProperty({
        description: 'restaurant 참조 key',
        example: 1
    })
    public restaurantId: number;

    @IsNotEmpty()
    @ApiProperty({
        description: '메뉴 제공 날짜',
        example: '2022-04-11'
    })
    public servingDate: Date;

    @Transform(({value}) => DietType[value])
    @IsNotEmpty()
    @ApiProperty({
        description: '제공 타입: 아침/브런치/점심/저녁',
        type: 'enum',
        enum: DietType
    })
    public dietType: DietType;

    @Transform(({value}) => value.trim())
    @ApiProperty({
        description: '메뉴명',
        example: '돈까스'
    })
    public title: string;

    @Transform(({value}) => value.trim())
    @ApiProperty({
        description: '메뉴 상세 설명',
        example: '어쩌구 저쩌구 이래저래해서 결국 우리집으로 오세요'
    })
    public detail: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '메뉴 사진1'
    })
    public image1: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '메뉴 사진2',
        required: false
    })
    public image2: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '메뉴 사진3',
        required: false
    })
    public image3: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: '메뉴 사진4',
        required: false
    })
    public image4: string;

}
