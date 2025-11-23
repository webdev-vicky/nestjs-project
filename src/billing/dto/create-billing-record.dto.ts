import { IsNumber, IsString, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateBillingRecordDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}

