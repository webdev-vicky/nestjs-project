import { Module } from '@nestjs/common';
import { JobTriggerService } from './job-trigger.service';
import { JobTriggerController } from './job-trigger.controller';
import { LogIngestionModule } from '../log-ingestion/log-ingestion.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [LogIngestionModule, BillingModule],
  controllers: [JobTriggerController],
  providers: [JobTriggerService],
})
export class JobTriggerModule {}

