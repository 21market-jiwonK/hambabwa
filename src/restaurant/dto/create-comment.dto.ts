import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {User} from "../../user/entities/user.entity";

export class CreateCommentDto {
    private _writer: User;

    @Transform(({ value }) => Number(value))
    @ApiProperty({
        description: 'restaurant 고유 id',
        example: 1
    })
    public restaurantId: number;

    @ApiProperty({
        description: '코멘트',
        example: '흥해라흥'
    })
    public comment: string;

    @ApiProperty({
        description: '별점',
        example: 4.5
    })
    public stars: number;

    get writer(): User {
        return this._writer;
    }

    set writer(user: User) {
        this._writer = user;
    }
}