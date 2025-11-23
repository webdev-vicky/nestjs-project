import { LogIngestionService } from './log-ingestion.service';
export declare class LogIngestionController {
    private readonly logIngestionService;
    constructor(logIngestionService: LogIngestionService);
    getAllLogs(): Promise<import("./entities/usage-log.entity").UsageLog[]>;
    getLogsByUser(userId: number): Promise<import("./entities/usage-log.entity").UsageLog[]>;
}
