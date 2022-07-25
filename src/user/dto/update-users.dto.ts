import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-users.dto";

export class UpdateUsersDto extends PickType(CreateUserDto, ['nickname'] as const) {}
