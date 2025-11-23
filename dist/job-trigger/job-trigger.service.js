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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobTriggerService = void 0;
const common_1 = require("@nestjs/common");
const log_ingestion_service_1 = require("../log-ingestion/log-ingestion.service");
const billing_service_1 = require("../billing/billing.service");
let JobTriggerService = class JobTriggerService {
    constructor(logIngestionService, billingService) {
        this.logIngestionService = logIngestionService;
        this.billingService = billingService;
    }
    async triggerLogProcessing() {
        try {
            await this.logIngestionService.processLogs();
            return { success: true, message: 'Log processing completed successfully' };
        }
        catch (error) {
            return { success: false, message: `Error processing logs: ${error.message}` };
        }
    }
    async triggerBillingRetries() {
        try {
            await this.billingService.processPendingRetries();
            return { success: true, message: 'Billing retries processed successfully' };
        }
        catch (error) {
            return { success: false, message: `Error processing billing retries: ${error.message}` };
        }
    }
    async triggerAll() {
        try {
            await this.logIngestionService.processLogs();
            await this.billingService.processPendingRetries();
            return { success: true, message: 'All jobs completed successfully' };
        }
        catch (error) {
            return { success: false, message: `Error processing jobs: ${error.message}` };
        }
    }
};
exports.JobTriggerService = JobTriggerService;
exports.JobTriggerService = JobTriggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [log_ingestion_service_1.LogIngestionService,
        billing_service_1.BillingService])
], JobTriggerService);
//# sourceMappingURL=job-trigger.service.js.map