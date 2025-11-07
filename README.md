# Finance Insurance Claims Portal UI Testing

A comprehensive UI automation testing framework for insurance claims portal using Playwright with TypeScript, targeting auto, home, and health insurance claim workflows.

## 🛡️ Overview

This project provides automated testing for insurance claims portal user interfaces, covering claim submission, processing, adjuster workflows, and compliance validation with insurance industry standards.

## 🎯 Features

- **Multi-line Insurance**: Auto, Home, Health, and Commercial claims
- **Claim Lifecycle**: Submission, review, investigation, settlement
- **Role-based Testing**: Claimants, Adjusters, Managers, Investigators
- **Document Management**: Upload, validation, processing workflows
- **Payment Processing**: Settlement calculations, payment workflows
- **Fraud Detection**: Suspicious claim identification and flagging
- **Compliance Testing**: State regulations, industry standards
- **Cross-browser Support**: Chromium, Firefox, WebKit, Mobile browsers
- **API Integration**: Backend services, third-party integrations

## 🛠️ Technology Stack

- **Language**: TypeScript
- **Testing Framework**: Playwright
- **Assertions**: Playwright Test Assertions
- **Reporting**: Playwright HTML Reports, Allure
- **CI/CD**: GitHub Actions
- **Database**: PostgreSQL (test environment)

## 📁 Project Structure

```
finance-insurance-claims-portal-ui-testing/
├── tests/
│   ├── claim-submission/    # Claim submission tests
│   ├── claim-processing/    # Processing workflow tests
│   ├── adjuster-workflows/  # Adjuster-specific tests
│   └── compliance/         # Regulatory compliance tests
├── pages/                  # Page Object Model
├── fixtures/              # Test data and fixtures
├── utils/                 # Utility functions
├── config/               # Configuration files
├── test-results/         # Test execution results
└── reports/             # Test reports
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pomo03606/finance-insurance-claims-portal-ui-testing.git
   cd finance-insurance-claims-portal-ui-testing
   ```

2. **Install dependencies**
   ```bash
   npm install
   npx playwright install
   ```

3. **Configure test environment**
   ```bash
   cp config/ui-config.json.example config/ui-config.json
   # Edit configuration with your test environment details
   ```

### Running Tests

#### All Tests
```bash
npm test
```

#### Specific Test Categories
```bash
npm run test:claim-submission
npm run test:processing
npm run test:adjuster
npm run test:compliance
```

#### Browser-specific Testing
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:mobile
```

#### Headed Mode (with browser UI)
```bash
npm run test:headed
```

#### Debug Mode
```bash
npm run test:debug
```

## 🧪 Test Scenarios

### Claim Submission
- ✅ Auto insurance claim submission (collision, comprehensive)
- ✅ Home insurance claim submission (property damage, theft)
- ✅ Health insurance claim submission (medical expenses)
- ✅ Document upload and validation
- ✅ Policy verification and coverage validation

### Claim Processing
- ✅ Initial claim review and triage
- ✅ Adjuster assignment workflows
- ✅ Investigation scheduling and management
- ✅ Settlement calculation and approval
- ✅ Payment processing and disbursement

### Adjuster Workflows
- ✅ Claim assignment and acceptance
- ✅ Investigation planning and execution
- ✅ Evidence collection and documentation
- ✅ Settlement recommendations
- ✅ Communication with stakeholders

### Compliance & Fraud Detection
- ✅ Regulatory compliance validation
- ✅ Suspicious activity identification
- ✅ Fraud scoring and flagging
- ✅ Audit trail verification
- ✅ Reporting and analytics

## 📊 Reporting

### Playwright HTML Report
```bash
npm run report
```

### Allure Reports
```bash
npm run allure:generate
npm run allure:serve
```

### Custom Dashboard
```bash
npm run dashboard
```

## ⚙️ Configuration

### Test Configuration
Edit `config/ui-config.json`:

```json
{
  "application": {
    "baseUrl": "https://claims-portal.insurancecorp.com",
    "timeout": 30000
  },
  "users": {
    "claimant": {
      "username": "test.claimant@email.com",
      "password": "Claimant123!"
    },
    "adjuster": {
      "username": "test.adjuster@insurancecorp.com",
      "password": "Adjuster123!"
    }
  },
  "browser": {
    "headless": false,
    "viewport": { "width": 1920, "height": 1080 }
  }
}
```

### Playwright Configuration
Main configuration in `playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['allure-playwright'],
    ['junit', { outputFile: 'test-results/junit-report.xml' }]
  ],
  use: {
    baseURL: 'https://claims-portal.insurancecorp.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } }
  ]
});
```

## 🏗️ Page Object Model

### Base Page
```typescript
export class BasePage {
  constructor(protected page: Page) {}
  
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
  
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
```

### Claim Submission Page
```typescript
export class ClaimSubmissionPage extends BasePage {
  private readonly claimTypeDropdown = this.page.locator('#claimType');
  private readonly submitButton = this.page.locator('[data-testid="submit-claim"]');
  
  async submitClaim(claimData: ClaimData): Promise<void> {
    // Implementation
  }
}
```

## 🔒 Security & Compliance

- **Data Privacy**: Sensitive data masking in reports
- **Access Controls**: Role-based test execution
- **Audit Compliance**: State insurance regulations
- **Security Testing**: Authentication, authorization validation

## 🧪 Test Data Management

### Dynamic Test Data
- Policy number generation
- Claim amount calculations
- Date/time scenarios
- Geographic variations

### Static Test Data
```typescript
export const testData = {
  policies: {
    auto: { number: 'AUTO123456', coverage: 'Full Coverage' },
    home: { number: 'HOME789012', coverage: 'Comprehensive' }
  },
  claims: {
    auto: { type: 'Collision', amount: 5000 },
    home: { type: 'Water Damage', amount: 15000 }
  }
};
```

## 🔄 Continuous Integration

GitHub Actions workflow includes:
- Multi-browser testing
- Parallel test execution
- Artifact collection (screenshots, videos, reports)
- Slack notifications
- Performance metrics

## 📈 Performance Testing

- Page load time validation
- Form submission performance
- Large file upload testing
- Concurrent user simulation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Finance Payment Gateway API Testing](../finance-payment-gateway-api-testing)
- [Finance Banking Transaction API Testing](../finance-banking-transaction-api-testing)
- [Finance Trading Platform UI Testing](../finance-trading-platform-ui-testing)

---

**Note**: This is a demo project for portfolio purposes. Ensure compliance with your organization's insurance regulations and data protection policies before adapting for production use.