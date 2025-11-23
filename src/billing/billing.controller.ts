import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingRecordDto } from './dto/create-billing-record.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  create(@Body() createBillingRecordDto: CreateBillingRecordDto) {
    return this.billingService.create(createBillingRecordDto);
  }

  @Get()
  findAll() {
    return this.billingService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.billingService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.findOne(id);
  }

  @Post(':id/process ')
  processBilling(@Param('id', ParseIntPipe) id: number) {
    return this.billingService.processBilling(id);
  }
}

