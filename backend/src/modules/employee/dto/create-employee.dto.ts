import { IsEmail, IsNumber, IsOptional, IsString, IsUUID, Matches, Min } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name must contain only alphabetic characters' })
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  @Min(10000, { message: 'Salary must be at least 10000' })
  salary?: number;

  @IsUUID()
  departmentId: string;
}
