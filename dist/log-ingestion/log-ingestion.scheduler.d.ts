import { LogIngestionService } from './log-ingestion.service';
import { BillingService } from '../billing/billing.service';
export declare class LogIngestionScheduler {
    private logIngestionService;
    private billingService;
    private readonly logger;
    constructor(logIngestionService: LogIngestionService, billingService: BillingService);
    handleHourlyLogProcessing(): Promise<void>;
}
