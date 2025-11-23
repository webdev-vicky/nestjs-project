import { JobTriggerService } from './job-trigger.service';
export declare class JobTriggerController {
    private readonly jobTriggerService;
    constructor(jobTriggerService: JobTriggerService);
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
