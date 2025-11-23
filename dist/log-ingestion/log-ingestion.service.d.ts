import { Repository } from 'typeorm';
import { UsageLog } from './entities/usage-log.entity';
import { ConfigService } from '../config/config.service';
import { BillingService } from '../billing/billing.service';
interface LogEntry {
    userId: number;
    service: string;
    quantity: number;
    timestamp: string;
}
export declare class LogIngestionService {
    private usageLogRepository;
    private configService;
    private billingService;
    private readonly logger;
    constructor(usageLogRepository: Repository<UsageLog>, configService: ConfigService, billingService: BillingService);
    loadLogsFromFile(): Promise<LogEntry[]>;
    processLogs(): Promise<void>;
    getAllLogs(): Promise<UsageLog[]>;
    getLogsByUser(userId: number): Promise<UsageLog[]>;
}
export {};
