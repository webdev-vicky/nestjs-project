import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogIngestionService } from './log-ingestion.service';
import { LogIngestionController } from './log-ingestion.controller';
import { LogIngestionScheduler } from './log-ingestion.scheduler';
import { UsageLog } from './entities/usage-log.entity';
import { ConfigModule } from '../config/config.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsageLog]),
    ConfigModule,
    BillingModule,
  ],
  controllers: [LogIngestionController],
  providers: [LogIngestionService, LogIngestionScheduler],
  exports: [LogIngestionService],
})
export class LogIngestionModule {}

