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
exports.JobTriggerController = void 0;
const common_1 = require("@nestjs/common");
const job_trigger_service_1 = require("./job-trigger.service");
let JobTriggerController = class JobTriggerController {
    constructor(jobTriggerService) {
        this.jobTriggerService = jobTriggerService;
    }
    triggerLogProcessing() {
        return this.jobTriggerService.triggerLogProcessing();
    }
    triggerBillingRetries() {
        return this.jobTriggerService.triggerBillingRetries();
    }
    triggerAll() {
        return this.jobTriggerService.triggerAll();
    }
};
exports.JobTriggerController = JobTriggerController;
__decorate([
    (0, common_1.Post)('process-logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobTriggerController.prototype, "triggerLogProcessing", null);
__decorate([
    (0, common_1.Post)('process-retries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobTriggerController.prototype, "triggerBillingRetries", null);
__decorate([
    (0, common_1.Post)('process-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobTriggerController.prototype, "triggerAll", null);
exports.JobTriggerController = JobTriggerController = __decorate([
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [job_trigger_service_1.JobTriggerService])
], JobTriggerController);
//# sourceMappingURL=job-trigger.controller.js.map