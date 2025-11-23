import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LogIngestionService } from './log-ingestion.service';

@Controller('logs')
export class LogIngestionController {
  constructor(private readonly logIngestionService: LogIngestionService) {}

  @Get()
  getAllLogs() {
    return this.logIngestionService.getAllLogs();
  }

  @Get('user/:userId')
  getLogsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.logIngestionService.getLogsByUser(userId);
  }
}

