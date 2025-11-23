import { Repository } from 'typeorm';
import { BillingRecord } from './entities/billing-record.entity';
import { WalletService } from '../wallet/wallet.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';
export declare class BillingService {
    private billingRepository;
    private walletService;
    private userService;
    private configService;
    constructor(billingRepository: Repository<BillingRecord>, walletService: WalletService, userService: UserService, configService: ConfigService);
    create(createBillingRecordDto: CreateBillingRecordDto): Promise<BillingRecord>;
    findAll(): Promise<BillingRecord[]>;
    findByUser(userId: number): Promise<BillingRecord[]>;
    findOne(id: number): Promise<BillingRecord>;
    processBilling(billingRecordId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    scheduleRetry(billingRecord: BillingRecord): Promise<void>;
    processPendingRetries(): Promise<void>;
    generateBillingFromUsage(userId: number, service: string, quantity: number, description?: string): Promise<BillingRecord>;
}
