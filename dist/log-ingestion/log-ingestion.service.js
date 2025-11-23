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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LogIngestionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogIngestionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usage_log_entity_1 = require("./entities/usage-log.entity");
const config_service_1 = require("../config/config.service");
const billing_service_1 = require("../billing/billing.service");
const fs = require("fs");
const path = require("path");
let LogIngestionService = LogIngestionService_1 = class LogIngestionService {
    constructor(usageLogRepository, configService, billingService) {
        this.usageLogRepository = usageLogRepository;
        this.configService = configService;
        this.billingService = billingService;
        this.logger = new common_1.Logger(LogIngestionService_1.name);
    }
    async loadLogsFromFile() {
        const filePath = this.configService.getLogFilePath();
        const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
        try {
            if (!fs.existsSync(absolutePath)) {
                this.logger.warn(`Log file not found at ${absolutePath}`);
                return [];
            }
            const fileContent = fs.readFileSync(absolutePath, 'utf-8');
            const logs = JSON.parse(fileContent);
            this.logger.log(`Loaded ${logs.length} log entries from file`);
            return logs;
        }
        catch (error) {
            this.logger.error(`Error loading logs from file: ${error instanceof Error ? error.message : String(error)}`);
            return [];
        }
    }
    async processLogs() {
        this.logger.log('Starting log processing...');
        const logs = await this.loadLogsFromFile();
        for (const logEntry of logs) {
            const existingLog = await this.usageLogRepository.findOne({
                where: {
                    userId: logEntry.userId,
                    service: logEntry.service,
                    timestamp: new Date(logEntry.timestamp),
                },
            });
            if (existingLog && existingLog.processed) {
                continue;
            }
            let usageLog = existingLog;
            if (!usageLog) {
                usageLog = this.usageLogRepository.create({
                    userId: logEntry.userId,
                    service: logEntry.service,
                    quantity: logEntry.quantity,
                    timestamp: new Date(logEntry.timestamp),
                    processed: false,
                });
                usageLog = await this.usageLogRepository.save(usageLog);
            }
            try {
                await this.billingService.generateBillingFromUsage(logEntry.userId, logEntry.service, logEntry.quantity, `Usage log: ${logEntry.service} - ${logEntry.quantity} units at ${logEntry.timestamp}`);
                usageLog.processed = true;
                await this.usageLogRepository.save(usageLog);
            }
            catch (error) {
                this.logger.error(`Error processing log for user ${logEntry.userId}: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        this.logger.log('Log processing completed');
    }
    async getAllLogs() {
        return await this.usageLogRepository.find({
            order: { timestamp: 'DESC' },
        });
    }
    async getLogsByUser(userId) {
        return await this.usageLogRepository.find({
            where: { userId },
            order: { timestamp: 'DESC' },
        });
    }
};
exports.LogIngestionService = LogIngestionService;
exports.LogIngestionService = LogIngestionService = LogIngestionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usage_log_entity_1.UsageLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_service_1.ConfigService,
        billing_service_1.BillingService])
], LogIngestionService);
//# sourceMappingURL=log-ingestion.service.js.map