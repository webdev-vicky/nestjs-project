import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingRecord, BillingStatus } from './entities/billing-record.entity';
import { WalletService } from '../wallet/wallet.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(BillingRecord)
    private billingRepository: Repository<BillingRecord>,
    private walletService: WalletService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async create(createBillingRecordDto: CreateBillingRecordDto): Promise<BillingRecord> {
    const billingRecord = this.billingRepository.create({
      ...createBillingRecordDto,
      status: BillingStatus.PENDING,
      retryCount: 0,
    });
    return await this.billingRepository.save(billingRecord);
  }

  async findAll(): Promise<BillingRecord[]> {
    return await this.billingRepository.find({ relations: ['user'] });
  }

  async findByUser(userId: number): Promise<BillingRecord[]> {
    return await this.billingRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<BillingRecord> {
    const billingRecord = await this.billingRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!billingRecord) {
      throw new NotFoundException(`Billing record with ID ${id} not found`);
    }
    return billingRecord;
  }

  async processBilling(billingRecordId: number): Promise<{ success: boolean; message: string }> {
    const billingRecord = await this.findOne(billingRecordId);

    if (billingRecord.status === BillingStatus.PAID) {
      return { success: true, message: 'Billing record already paid' };
    }

    const result = await this.walletService.charge(
      billingRecord.userId,
      Number(billingRecord.amount),
    );

    if (result.success) {
      billingRecord.status = BillingStatus.PAID;
      billingRecord.retryCount = 0;
      billingRecord.nextRetryAt = null;
      await this.billingRepository.save(billingRecord);
      return { success: true, message: 'Billing record paid successfully' };
    } else {
      // Insufficient balance - schedule retry
      await this.scheduleRetry(billingRecord);
      return {
        success: false,
        message: `Insufficient balance. Retry scheduled. Current balance: ${result.remainingBalance}`,
      };
    }
  }

  async scheduleRetry(billingRecord: BillingRecord): Promise<void> {
    const maxRetries = this.configService.getMaxRetries();
    const baseDelay = this.configService.getRetryBaseDelay();

    if (billingRecord.retryCount >= maxRetries) {
      // Max retries reached - mark as failed and suspend user
      billingRecord.status = BillingStatus.FAILED;
      billingRecord.nextRetryAt = null;
      await this.billingRepository.save(billingRecord);
      await this.userService.suspend(billingRecord.userId);
      return;
    }

    // Calculate exponential backoff delay: baseDelay * 2^retryCount
    const delay = baseDelay * Math.pow(2, billingRecord.retryCount);
    const nextRetryAt = new Date(Date.now() + delay);

    billingRecord.retryCount += 1;
    billingRecord.nextRetryAt = nextRetryAt;
    billingRecord.status = BillingStatus.PENDING;
    await this.billingRepository.save(billingRecord);
  }

  async processPendingRetries(): Promise<void> {
    const now = new Date();
    const pendingRecords = await this.billingRepository.find({
      where: {
        status: BillingStatus.PENDING,
      },
    });

    for (const record of pendingRecords) {
      if (record.nextRetryAt && record.nextRetryAt <= now) {
        await this.processBilling(record.id);
      } else if (!record.nextRetryAt) {
        // Process records that haven't been retried yet
        await this.processBilling(record.id);
      }
    }
  }

  async generateBillingFromUsage(
    userId: number,
    service: string,
    quantity: number,
    description?: string,
  ): Promise<BillingRecord> {
    const pricingRules = this.configService.getPricingRules();
    const pricePerUnit = pricingRules[service] || 0.01; // Default price
    const amount = pricePerUnit * quantity;

    const billingRecord = this.billingRepository.create({
      userId,
      amount,
      description: description || `Usage for ${service}: ${quantity} units`,
      status: BillingStatus.PENDING,
      retryCount: 0,
    });

    const savedRecord = await this.billingRepository.save(billingRecord);
    
    // Attempt to charge immediately
    await this.processBilling(savedRecord.id);

    return savedRecord;
  }
}

