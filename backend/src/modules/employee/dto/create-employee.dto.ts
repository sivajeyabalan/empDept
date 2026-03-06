import { IsEmail, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @IsUUID()
  departmentId: string;
}
