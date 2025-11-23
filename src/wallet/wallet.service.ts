import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/entities/user.entity';
import { AddFundsDto } from './dto/add-funds.dto';
import { ChargeWalletDto } from './dto/charge-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async createWallet(userId: number): Promise<Wallet> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const existingWallet = await this.walletRepository.findOne({
      where: { userId },
    });

    if (existingWallet) {
      return existingWallet;
    }

    const wallet = this.walletRepository.create({
      userId,
      balance: 0,
    });

    return await this.walletRepository.save(wallet);
  }

  async getWallet(userId: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!wallet) {
      return await this.createWallet(userId);
    }

    return wallet;
  }

  async addFunds(userId: number, addFundsDto: AddFundsDto): Promise<Wallet> {
    const wallet = await this.getWallet(userId);
    wallet.balance = Number(wallet.balance) + Number(addFundsDto.amount);
    return await this.walletRepository.save(wallet);
  }

  async charge(userId: number, amount: number): Promise<{ success: boolean; remainingBalance: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(Wallet, {
        where: { userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!wallet) {
        throw new NotFoundException(`Wallet for user ${userId} not found`);
      }

      const currentBalance = Number(wallet.balance);
      const chargeAmount = Number(amount);

      if (currentBalance < chargeAmount) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          remainingBalance: currentBalance,
        };
      }

      wallet.balance = currentBalance - chargeAmount;
      await queryRunner.manager.save(wallet);
      await queryRunner.commitTransaction();

      return {
        success: true,
        remainingBalance: Number(wallet.balance),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getBalance(userId: number): Promise<number> {
    const wallet = await this.getWallet(userId);
    return Number(wallet.balance);
  }
}

