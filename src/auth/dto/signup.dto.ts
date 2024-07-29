import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a correct email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  // @IsNotEmpty()
  // readonly dob: string; // Assuming age is a number

  @IsNotEmpty()
  @IsString()
  readonly occupation: string;

  @IsNotEmpty()
  @IsString()
  readonly bio: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
