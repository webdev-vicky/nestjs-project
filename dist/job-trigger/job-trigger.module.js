"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobTriggerModule = void 0;
const common_1 = require("@nestjs/common");
const job_trigger_service_1 = require("./job-trigger.service");
const job_trigger_controller_1 = require("./job-trigger.controller");
const log_ingestion_module_1 = require("../log-ingestion/log-ingestion.module");
const billing_module_1 = require("../billing/billing.module");
let JobTriggerModule = class JobTriggerModule {
};
exports.JobTriggerModule = JobTriggerModule;
exports.JobTriggerModule = JobTriggerModule = __decorate([
    (0, common_1.Module)({
        imports: [log_ingestion_module_1.LogIngestionModule, billing_module_1.BillingModule],
        controllers: [job_trigger_controller_1.JobTriggerController],
        providers: [job_trigger_service_1.JobTriggerService],
    })
], JobTriggerModule);
//# sourceMappingURL=job-trigger.module.js.map