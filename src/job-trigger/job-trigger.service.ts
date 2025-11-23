import { Injectable } from '@nestjs/common';
import { LogIngestionService } from '../log-ingestion/log-ingestion.service';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class JobTriggerService {
  constructor(
    private logIngestionService: LogIngestionService,
    private billingService: BillingService,
  ) {}

  async triggerLogProcessing(): Promise<{ success: boolean; message: string }> {
    try {
      await this.logIngestionService.processLogs();
      return { success: true, message: 'Log processing completed successfully' };
    } catch (error) {
      return { success: false, message: `Error processing logs: ${error.message}` };
    }
  }

  async triggerBillingRetries(): Promise<{ success: boolean; message: string }> {
    try {
      await this.billingService.processPendingRetries();
      return { success: true, message: 'Billing retries processed successfully' };
    } catch (error) {
      return { success: false, message: `Error processing billing retries: ${error.message}` };
    }
  }

  async triggerAll(): Promise<{ success: boolean; message: string }> {
    try {
      await this.logIngestionService.processLogs();
      await this.billingService.processPendingRetries();
      return { success: true, message: 'All jobs completed successfully' };
    } catch (error) {
      return { success: false, message: `Error processing jobs: ${error.message}` };
    }
  }
}

