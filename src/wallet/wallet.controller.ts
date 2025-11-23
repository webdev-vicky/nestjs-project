import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AddFundsDto } from './dto/add-funds.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId')
  getWallet(@Param('userId', ParseIntPipe) userId: number) {
    return this.walletService.getWallet(userId);
  }

  @Get(':userId/balance')
  getBalance(@Param('userId', ParseIntPipe) userId: number) {
    return this.walletService.getBalance(userId);
  }

  @Post(':userId/add-funds')
  addFunds(@Param('userId', ParseIntPipe) userId: number, @Body() addFundsDto: AddFundsDto) {
    return this.walletService.addFunds(userId, addFundsDto);
  }
}

