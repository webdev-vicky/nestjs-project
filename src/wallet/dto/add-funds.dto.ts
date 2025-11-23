import { IsNumber, IsPositive, Min } from 'class-validator';

export class AddFundsDto {
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;
}

