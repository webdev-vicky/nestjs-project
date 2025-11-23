import { Controller, Post } from '@nestjs/common';
import { JobTriggerService } from './job-trigger.service';

@Controller('jobs')
export class JobTriggerController {
  constructor(private readonly jobTriggerService: JobTriggerService) {}

  @Post('process-logs')
  triggerLogProcessing() {
    return this.jobTriggerService.triggerLogProcessing();
  }

  @Post('process-retries')
  triggerBillingRetries() {
    return this.jobTriggerService.triggerBillingRetries();
  }

  @Post('process-all')
  triggerAll() {
    return this.jobTriggerService.triggerAll();
  }
}

