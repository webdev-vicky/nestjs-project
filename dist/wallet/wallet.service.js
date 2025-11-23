"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
const user_entity_1 = require("../user/entities/user.entity");
let WalletService = class WalletService {
    constructor(walletRepository, userRepository, dataSource) {
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.dataSource = dataSource;
    }
    async createWallet(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
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
    async getWallet(userId) {
        const wallet = await this.walletRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
        if (!wallet) {
            return await this.createWallet(userId);
        }
        return wallet;
    }
    async addFunds(userId, addFundsDto) {
        const wallet = await this.getWallet(userId);
        wallet.balance = Number(wallet.balance) + Number(addFundsDto.amount);
        return await this.walletRepository.save(wallet);
    }
    async charge(userId, amount) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const wallet = await queryRunner.manager.findOne(wallet_entity_1.Wallet, {
                where: { userId },
                lock: { mode: 'pessimistic_write' },
            });
            if (!wallet) {
                throw new common_1.NotFoundException(`Wallet for user ${userId} not found`);
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getBalance(userId) {
        const wallet = await this.getWallet(userId);
        return Number(wallet.balance);
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], WalletService);
//# sourceMappingURL=wallet.service.js.map