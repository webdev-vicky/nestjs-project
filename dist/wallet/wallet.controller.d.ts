import { WalletService } from './wallet.service';
import { AddFundsDto } from './dto/add-funds.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(userId: number): Promise<import("./entities/wallet.entity").Wallet>;
    getBalance(userId: number): Promise<number>;
    addFunds(userId: number, addFundsDto: AddFundsDto): Promise<import("./entities/wallet.entity").Wallet>;
}
