import {ApiProperty} from "@nestjs/swagger";
import {User} from "../entities/user.entity";

export enum MyList {
    COMMENT = "comment",
    FAVORITE = "favorite"
}

export class SearchMyDto {
    private _writer: User;

    @ApiProperty({
        type: 'enum',
        enum: MyList,
        description: 'comment | favorite',
        example: MyList.COMMENT
    })
    type: MyList;

    get writer(): User {
        return this._writer;
    }

    set writer(user: User) {
        this._writer = user;
    }

    get getType() {
        return this.type;
    }

    set setType(type: MyList) {
        this.type = type;
    }
}