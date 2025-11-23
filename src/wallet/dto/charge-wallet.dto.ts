import { IsNumber, IsPositive, Min } from 'class-validator';

export class ChargeWalletDto {
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;
}

