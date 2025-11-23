import { Repository, DataSource } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/entities/user.entity';
import { AddFundsDto } from './dto/add-funds.dto';
export declare class WalletService {
    private walletRepository;
    private userRepository;
    private dataSource;
    constructor(walletRepository: Repository<Wallet>, userRepository: Repository<User>, dataSource: DataSource);
    createWallet(userId: number): Promise<Wallet>;
    getWallet(userId: number): Promise<Wallet>;
    addFunds(userId: number, addFundsDto: AddFundsDto): Promise<Wallet>;
    charge(userId: number, amount: number): Promise<{
        success: boolean;
        remainingBalance: number;
    }>;
    getBalance(userId: number): Promise<number>;
}
