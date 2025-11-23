import { Wallet } from '../../wallet/entities/wallet.entity';
export declare enum UserStatus {
    ACTIVE = "active",
    SUSPENDED = "suspended"
}
export declare class User {
    id: number;
    email: string;
    name: string;
    status: UserStatus;
    wallet: Wallet;
    createdAt: Date;
    updatedAt: Date;
}
