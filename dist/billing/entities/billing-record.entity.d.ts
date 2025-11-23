import { User } from '../../user/entities/user.entity';
export declare enum BillingStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
export declare class BillingRecord {
    id: number;
    userId: number;
    user: User;
    amount: number;
    status: BillingStatus;
    description: string;
    retryCount: number;
    nextRetryAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
