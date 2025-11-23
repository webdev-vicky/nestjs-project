import { LogIngestionService } from '../log-ingestion/log-ingestion.service';
import { BillingService } from '../billing/billing.service';
export declare class JobTriggerService {
    private logIngestionService;
    private billingService;
    constructor(logIngestionService: LogIngestionService, billingService: BillingService);
    triggerLogProcessing(): Promise<{
        success: boolean;
        message: string;
    }>;
    triggerBillingRetries(): Promise<{
        success: boolean;
        message: string;
    }>;
    triggerAll(): Promise<{
        success: boolean;
        message: string;
    }>;
}
