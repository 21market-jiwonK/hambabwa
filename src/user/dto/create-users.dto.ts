import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "이메일",
    example: "test@hambabwa.kr",
  })
  public email: string;

  @ApiProperty({
    description: "닉네임",
    example: "김지원",
  })
  public nickname: string;

  @ApiProperty({
    description: "비밀번호",
    example: "123",
  })
  public password: string;
}
