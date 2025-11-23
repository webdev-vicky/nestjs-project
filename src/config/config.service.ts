import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  // Pricing rules: service -> price per unit
  getPricingRules(): Record<string, number> {
    return {
      'api-calls': 0.01,
      'storage': 0.05,
      'bandwidth': 0.02,
      'compute': 0.10,
    };
  }

  getLogFilePath(): string {
    return process.env.LOG_FILE_PATH || './data/usage-logs.json';
  }

  getMaxRetries(): number {
    return 5;
  }

  getRetryBaseDelay(): number {
    return 1000; // 1 second
  }
}

