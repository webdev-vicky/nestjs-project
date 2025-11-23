"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogIngestionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const log_ingestion_service_1 = require("./log-ingestion.service");
const log_ingestion_controller_1 = require("./log-ingestion.controller");
const log_ingestion_scheduler_1 = require("./log-ingestion.scheduler");
const usage_log_entity_1 = require("./entities/usage-log.entity");
const config_module_1 = require("../config/config.module");
const billing_module_1 = require("../billing/billing.module");
let LogIngestionModule = class LogIngestionModule {
};
exports.LogIngestionModule = LogIngestionModule;
exports.LogIngestionModule = LogIngestionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([usage_log_entity_1.UsageLog]),
            config_module_1.ConfigModule,
            billing_module_1.BillingModule,
        ],
        controllers: [log_ingestion_controller_1.LogIngestionController],
        providers: [log_ingestion_service_1.LogIngestionService, log_ingestion_scheduler_1.LogIngestionScheduler],
        exports: [log_ingestion_service_1.LogIngestionService],
    })
], LogIngestionModule);
//# sourceMappingURL=log-ingestion.module.js.map