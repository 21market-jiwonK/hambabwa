import { ApiProperty, PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-users.dto";

export class UpdateUsersDto extends PickType(CreateUserDto, ['nickname'] as const) {
    @ApiProperty({
      type: 'string',
      format: 'binary',
      required: false,
      description: "프로필 사진",
    })
    public imageUrl: string;
}
