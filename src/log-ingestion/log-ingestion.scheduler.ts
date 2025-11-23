import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LogIngestionService } from './log-ingestion.service';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class LogIngestionScheduler {
  private readonly logger = new Logger(LogIngestionScheduler.name);

  constructor(
    private logIngestionService: LogIngestionService,
    private billingService: BillingService,
  ) {}

  // Run every hour
  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyLogProcessing() {
    this.logger.log('Running scheduled hourly log processing...');
    try {
      await this.logIngestionService.processLogs();
      // Also process pending retries
      await this.billingService.processPendingRetries();
      this.logger.log('Scheduled log processing completed');
    } catch (error) {
      this.logger.error(`Error in scheduled log processing: ${error.message}`);
    }
  }
}

