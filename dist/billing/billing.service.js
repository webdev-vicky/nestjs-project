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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const billing_record_entity_1 = require("./entities/billing-record.entity");
const wallet_service_1 = require("../wallet/wallet.service");
const user_service_1 = require("../user/user.service");
const config_service_1 = require("../config/config.service");
let BillingService = class BillingService {
    constructor(billingRepository, walletService, userService, configService) {
        this.billingRepository = billingRepository;
        this.walletService = walletService;
        this.userService = userService;
        this.configService = configService;
    }
    async create(createBillingRecordDto) {
        const billingRecord = this.billingRepository.create({
            ...createBillingRecordDto,
            status: billing_record_entity_1.BillingStatus.PENDING,
            retryCount: 0,
        });
        return await this.billingRepository.save(billingRecord);
    }
    async findAll() {
        return await this.billingRepository.find({ relations: ['user'] });
    }
    async findByUser(userId) {
        return await this.billingRepository.find({
            where: { userId },
            relations: ['user'],
        });
    }
    async findOne(id) {
        const billingRecord = await this.billingRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!billingRecord) {
            throw new common_1.NotFoundException(`Billing record with ID ${id} not found`);
        }
        return billingRecord;
    }
    async processBilling(billingRecordId) {
        const billingRecord = await this.findOne(billingRecordId);
        if (billingRecord.status === billing_record_entity_1.BillingStatus.PAID) {
            return { success: true, message: 'Billing record already paid' };
        }
        const result = await this.walletService.charge(billingRecord.userId, Number(billingRecord.amount));
        if (result.success) {
            billingRecord.status = billing_record_entity_1.BillingStatus.PAID;
            billingRecord.retryCount = 0;
            billingRecord.nextRetryAt = null;
            await this.billingRepository.save(billingRecord);
            return { success: true, message: 'Billing record paid successfully' };
        }
        else {
            await this.scheduleRetry(billingRecord);
            return {
                success: false,
                message: `Insufficient balance. Retry scheduled. Current balance: ${result.remainingBalance}`,
            };
        }
    }
    async scheduleRetry(billingRecord) {
        const maxRetries = this.configService.getMaxRetries();
        const baseDelay = this.configService.getRetryBaseDelay();
        if (billingRecord.retryCount >= maxRetries) {
            billingRecord.status = billing_record_entity_1.BillingStatus.FAILED;
            billingRecord.nextRetryAt = null;
            await this.billingRepository.save(billingRecord);
            await this.userService.suspend(billingRecord.userId);
            return;
        }
        const delay = baseDelay * Math.pow(2, billingRecord.retryCount);
        const nextRetryAt = new Date(Date.now() + delay);
        billingRecord.retryCount += 1;
        billingRecord.nextRetryAt = nextRetryAt;
        billingRecord.status = billing_record_entity_1.BillingStatus.PENDING;
        await this.billingRepository.save(billingRecord);
    }
    async processPendingRetries() {
        const now = new Date();
        const pendingRecords = await this.billingRepository.find({
            where: {
                status: billing_record_entity_1.BillingStatus.PENDING,
            },
        });
        for (const record of pendingRecords) {
            if (record.nextRetryAt && record.nextRetryAt <= now) {
                await this.processBilling(record.id);
            }
            else if (!record.nextRetryAt) {
                await this.processBilling(record.id);
            }
        }
    }
    async generateBillingFromUsage(userId, service, quantity, description) {
        const pricingRules = this.configService.getPricingRules();
        const pricePerUnit = pricingRules[service] || 0.01;
        const amount = pricePerUnit * quantity;
        const billingRecord = this.billingRepository.create({
            userId,
            amount,
            description: description || `Usage for ${service}: ${quantity} units`,
            status: billing_record_entity_1.BillingStatus.PENDING,
            retryCount: 0,
        });
        const savedRecord = await this.billingRepository.save(billingRecord);
        await this.processBilling(savedRecord.id);
        return savedRecord;
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(billing_record_entity_1.BillingRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        wallet_service_1.WalletService,
        user_service_1.UserService,
        config_service_1.ConfigService])
], BillingService);
//# sourceMappingURL=billing.service.js.map