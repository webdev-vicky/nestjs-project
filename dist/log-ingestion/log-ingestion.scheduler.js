"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LogIngestionScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogIngestionScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const log_ingestion_service_1 = require("./log-ingestion.service");
const billing_service_1 = require("../billing/billing.service");
let LogIngestionScheduler = LogIngestionScheduler_1 = class LogIngestionScheduler {
    constructor(logIngestionService, billingService) {
        this.logIngestionService = logIngestionService;
        this.billingService = billingService;
        this.logger = new common_1.Logger(LogIngestionScheduler_1.name);
    }
    async handleHourlyLogProcessing() {
        this.logger.log('Running scheduled hourly log processing...');
        try {
            await this.logIngestionService.processLogs();
            await this.billingService.processPendingRetries();
            this.logger.log('Scheduled log processing completed');
        }
        catch (error) {
            this.logger.error(`Error in scheduled log processing: ${error.message}`);
        }
    }
};
exports.LogIngestionScheduler = LogIngestionScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogIngestionScheduler.prototype, "handleHourlyLogProcessing", null);
exports.LogIngestionScheduler = LogIngestionScheduler = LogIngestionScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [log_ingestion_service_1.LogIngestionService,
        billing_service_1.BillingService])
], LogIngestionScheduler);
//# sourceMappingURL=log-ingestion.scheduler.js.map