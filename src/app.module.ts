import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { BillingModule } from './billing/billing.module';
import { LogIngestionModule } from './log-ingestion/log-ingestion.module';
import { JobTriggerModule } from './job-trigger/job-trigger.module';
import { User } from './user/entities/user.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { BillingRecord } from './billing/entities/billing-record.entity';
import { UsageLog } from './log-ingestion/entities/usage-log.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'billing.db',
      entities: [User, Wallet, BillingRecord, UsageLog],
      synchronize: true,
    }),
    ConfigModule,
    UserModule,
    WalletModule,
    BillingModule,
    LogIngestionModule,
    JobTriggerModule,
  ],
})
export class AppModule {}

