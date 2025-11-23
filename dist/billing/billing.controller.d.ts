import { BillingService } from './billing.service';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    create(createBillingRecordDto: CreateBillingRecordDto): Promise<import("./entities/billing-record.entity").BillingRecord>;
    findAll(): Promise<import("./entities/billing-record.entity").BillingRecord[]>;
    findByUser(userId: number): Promise<import("./entities/billing-record.entity").BillingRecord[]>;
    findOne(id: number): Promise<import("./entities/billing-record.entity").BillingRecord>;
    processBilling(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
