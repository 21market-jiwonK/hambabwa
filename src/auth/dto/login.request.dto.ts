import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestDto {
  @ApiProperty({
    description: "이메일",
    example: "test@hambabwa.kr",
  })
  public email: string;

  @ApiProperty({
    description: "password",
    example: "123",
  })
  public password: string;
}
