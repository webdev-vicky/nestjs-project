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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogIngestionController = void 0;
const common_1 = require("@nestjs/common");
const log_ingestion_service_1 = require("./log-ingestion.service");
let LogIngestionController = class LogIngestionController {
    constructor(logIngestionService) {
        this.logIngestionService = logIngestionService;
    }
    getAllLogs() {
        return this.logIngestionService.getAllLogs();
    }
    getLogsByUser(userId) {
        return this.logIngestionService.getLogsByUser(userId);
    }
};
exports.LogIngestionController = LogIngestionController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LogIngestionController.prototype, "getAllLogs", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LogIngestionController.prototype, "getLogsByUser", null);
exports.LogIngestionController = LogIngestionController = __decorate([
    (0, common_1.Controller)('logs'),
    __metadata("design:paramtypes", [log_ingestion_service_1.LogIngestionService])
], LogIngestionController);
//# sourceMappingURL=log-ingestion.controller.js.map