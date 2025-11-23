import { User } from '../../user/entities/user.entity';
export declare class Wallet {
    id: number;
    userId: number;
    user: User;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}
