# NestJS Billing Microservice

A comprehensive NestJS microservice for log ingestion, billing automation, wallet management, and user suspension with retry logic.

## Features

- **Log Ingestion**: Load usage logs from JSON file
- **Scheduled Processing**: Parse logs every hour automatically
- **Billing Automation**: Generate billing records based on pricing rules
- **Wallet Transactions**: Charge users from their wallet balance
- **Retry Logic**: Exponential backoff retry mechanism (max 5 attempts) for failed charges
- **User Suspension**: Automatically suspend users with insufficient balance after max retries
- **REST API**: Complete API for user management, wallet operations, billing records, and job triggers

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will run on `http://localhost:3000`

## API Endpoints

### User Management

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/suspend` - Suspend user
- `POST /users/:id/activate` - Activate user

### Wallet Operations

- `GET /wallets/:userId` - Get wallet for user
- `GET /wallets/:userId/balance` - Get wallet balance
- `POST /wallets/:userId/add-funds` - Add funds to wallet

### Billing Records

- `POST /billing` - Create billing record
- `GET /billing` - Get all billing records
- `GET /billing/user/:userId` - Get billing records for user
- `GET /billing/:id` - Get billing record by ID
- `POST /billing/:id/process` - Process billing record (charge wallet)

### Usage Logs

- `GET /logs` - Get all usage logs
- `GET /logs/user/:userId` - Get usage logs for user

### Job Triggers

- `POST /jobs/process-logs` - Manually trigger log processing
- `POST /jobs/process-retries` - Manually trigger billing retries
- `POST /jobs/process-all` - Trigger both log processing and retries

## Pricing Rules

Default pricing (configurable in `ConfigService`):
- `api-calls`: $0.01 per unit
- `storage`: $0.05 per unit
- `bandwidth`: $0.02 per unit
- `compute`: $0.10 per unit

## Retry Logic

When a user has insufficient balance:
1. First attempt: Immediate charge attempt
2. Retry attempts: Exponential backoff (1s, 2s, 4s, 8s, 16s)
3. Max retries: 5 attempts
4. After max retries: User is suspended and billing record marked as failed

## Log File

Usage logs are loaded from `./data/usage-logs.json` (configurable via `LOG_FILE_PATH` environment variable).

## Database

The application uses SQLite database (`billing.db`) for persistence. The database is automatically created on first run.

## Scheduled Jobs

- **Hourly Log Processing**: Runs every hour to process new usage logs and generate billing records
- **Retry Processing**: Processes pending billing retries during scheduled runs

