import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsageLog } from './entities/usage-log.entity';
import { ConfigService } from '../config/config.service';
import { BillingService } from '../billing/billing.service';
import * as fs from 'fs';
import * as path from 'path';

interface LogEntry {
  userId: number;
  service: string;
  quantity: number;
  timestamp: string;
}

@Injectable()
export class LogIngestionService {
  private readonly logger = new Logger(LogIngestionService.name);

  constructor(
    @InjectRepository(UsageLog)
    private usageLogRepository: Repository<UsageLog>,
    private configService: ConfigService,
    private billingService: BillingService,
  ) {}

  async loadLogsFromFile(): Promise<LogEntry[]> {
    const filePath = this.configService.getLogFilePath();
    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

    try {
      if (!fs.existsSync(absolutePath)) {
        this.logger.warn(`Log file not found at ${absolutePath}`);
        return [];
      }

      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const logs: LogEntry[] = JSON.parse(fileContent);

      this.logger.log(`Loaded ${logs.length} log entries from file`);
      return logs;
    } catch (error) {
      this.logger.error(`Error loading logs from file: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async processLogs(): Promise<void> {
    this.logger.log('Starting log processing...');
    const logs = await this.loadLogsFromFile();

    for (const logEntry of logs) {
      // Check if log already processed
      const existingLog = await this.usageLogRepository.findOne({
        where: {
          userId: logEntry.userId,
          service: logEntry.service,
          timestamp: new Date(logEntry.timestamp),
        },
      });

      if (existingLog && existingLog.processed) {
        continue;
      }

      // Save usage log
      let usageLog = existingLog;
      if (!usageLog) {
        usageLog = this.usageLogRepository.create({
          userId: logEntry.userId,
          service: logEntry.service,
          quantity: logEntry.quantity,
          timestamp: new Date(logEntry.timestamp),
          processed: false,
        });
        usageLog = await this.usageLogRepository.save(usageLog);
      }

      // Generate billing record
      try {
        await this.billingService.generateBillingFromUsage(
          logEntry.userId,
          logEntry.service,
          logEntry.quantity,
          `Usage log: ${logEntry.service} - ${logEntry.quantity} units at ${logEntry.timestamp}`,
        );

        // Mark as processed
        usageLog.processed = true;
        await this.usageLogRepository.save(usageLog);
      } catch (error) {
        this.logger.error(`Error processing log for user ${logEntry.userId}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    this.logger.log('Log processing completed');
  }

  async getAllLogs(): Promise<UsageLog[]> {
    return await this.usageLogRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async getLogsByUser(userId: number): Promise<UsageLog[]> {
    return await this.usageLogRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
    });
  }
}

