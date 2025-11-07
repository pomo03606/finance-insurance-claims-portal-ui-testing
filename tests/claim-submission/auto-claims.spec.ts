import { test, expect, Page } from '@playwright/test';
import { ClaimSubmissionPage } from '../pages/ClaimSubmissionPage';
import { LoginPage } from '../pages/LoginPage';
import { testConfig } from '../config/testConfig';

test.describe('Auto Insurance Claim Submission', () => {
  let page: Page;
  let loginPage: LoginPage;
  let claimSubmissionPage: ClaimSubmissionPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    claimSubmissionPage = new ClaimSubmissionPage(page);
    
    // Login as claimant
    await loginPage.goto();
    await loginPage.login(
      testConfig.users.claimant.username,
      testConfig.users.claimant.password
    );
  });

  test('Submit auto collision claim with valid details', async () => {
    // Arrange
    const claimData = {
      type: 'Auto',
      subtype: 'Collision',
      incidentDate: '2023-12-01',
      description: 'Rear-end collision at intersection of Main St and Oak Ave',
      amount: 5000.00,
      vehicleInfo: {
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        vin: '1HGBH41JXMN109186',
        licensePlate: 'ABC123'
      },
      location: {
        address: '123 Main St, Anytown, ST 12345',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      policeReport: {
        reportNumber: 'PR2023120001',
        officerName: 'Officer Smith',
        department: 'Anytown Police Department'
      }
    };

    // Act
    await claimSubmissionPage.navigateToClaimSubmission();
    await claimSubmissionPage.selectClaimType(claimData.type);
    await claimSubmissionPage.selectClaimSubtype(claimData.subtype);
    await claimSubmissionPage.enterIncidentDetails(claimData);
    await claimSubmissionPage.enterVehicleInformation(claimData.vehicleInfo);
    await claimSubmissionPage.enterLocationDetails(claimData.location);
    await claimSubmissionPage.enterPoliceReportInfo(claimData.policeReport);
    
    // Upload supporting documents
    await claimSubmissionPage.uploadDocument('photos', 'test-files/accident-photos.zip');
    await claimSubmissionPage.uploadDocument('police-report', 'test-files/police-report.pdf');
    await claimSubmissionPage.uploadDocument('repair-estimate', 'test-files/repair-estimate.pdf');
    
    await claimSubmissionPage.submitClaim();

    // Assert
    await expect(claimSubmissionPage.getSuccessMessage()).toContainText('Claim submitted successfully');
    
    const claimNumber = await claimSubmissionPage.getClaimNumber();
    expect(claimNumber).toMatch(/^AUTO\d{10}$/);
    
    // Verify claim appears in dashboard
    await claimSubmissionPage.navigateToClaimsDashboard();
    await expect(claimSubmissionPage.getClaimByNumber(claimNumber)).toBeVisible();
    
    // Verify claim status
    const status = await claimSubmissionPage.getClaimStatus(claimNumber);
    expect(status).toBe('Under Review');
  });

  test('Submit comprehensive claim for theft', async () => {
    // Arrange
    const claimData = {
      type: 'Auto',
      subtype: 'Comprehensive',
      incidentType: 'Theft',
      incidentDate: '2023-11-25',
      description: 'Vehicle stolen from parking garage',
      amount: 25000.00,
      vehicleInfo: {
        year: 2022,
        make: 'Honda',
        model: 'Accord',
        vin: '1HGCV1F3XMA123456',
        licensePlate: 'XYZ789'
      },
      location: {
        address: '456 Business Plaza, Downtown, ST 12345',
        coordinates: { lat: 40.7589, lng: -73.9851 }
      },
      policeReport: {
        reportNumber: 'PR2023112501',
        officerName: 'Detective Johnson',
        department: 'Metro Police Department'
      },
      theftDetails: {
        timeDiscovered: '2023-11-25T08:30:00',
        lastSeenTime: '2023-11-24T18:00:00',
        keysStatus: 'With owner',
        securityFeatures: ['Alarm system', 'GPS tracking', 'Immobilizer']
      }
    };

    // Act
    await claimSubmissionPage.navigateToClaimSubmission();
    await claimSubmissionPage.selectClaimType(claimData.type);
    await claimSubmissionPage.selectClaimSubtype(claimData.subtype);
    await claimSubmissionPage.selectIncidentType(claimData.incidentType);
    await claimSubmissionPage.enterIncidentDetails(claimData);
    await claimSubmissionPage.enterVehicleInformation(claimData.vehicleInfo);
    await claimSubmissionPage.enterLocationDetails(claimData.location);
    await claimSubmissionPage.enterPoliceReportInfo(claimData.policeReport);
    await claimSubmissionPage.enterTheftDetails(claimData.theftDetails);
    
    await claimSubmissionPage.uploadDocument('police-report', 'test-files/theft-police-report.pdf');
    await claimSubmissionPage.uploadDocument('vehicle-registration', 'test-files/vehicle-registration.pdf');
    await claimSubmissionPage.uploadDocument('keys-photos', 'test-files/keys-in-possession.jpg');
    
    await claimSubmissionPage.submitClaim();

    // Assert
    await expect(claimSubmissionPage.getSuccessMessage()).toContainText('Comprehensive claim submitted');
    
    const claimNumber = await claimSubmissionPage.getClaimNumber();
    expect(claimNumber).toMatch(/^COMP\d{10}$/);
    
    // Verify special investigation unit (SIU) flag for theft claims
    await claimSubmissionPage.navigateToClaimDetails(claimNumber);
    const siuFlag = await claimSubmissionPage.getSIUFlag();
    expect(siuFlag).toBe('Pending SIU Review');
  });

  test('Validate required fields and error handling', async () => {
    // Act - Try to submit without required fields
    await claimSubmissionPage.navigateToClaimSubmission();
    await claimSubmissionPage.submitClaim();

    // Assert
    await expect(claimSubmissionPage.getErrorMessage()).toContainText('Please fill in all required fields');
    
    // Check specific field validations
    await expect(claimSubmissionPage.getFieldError('claimType')).toContainText('Claim type is required');
    await expect(claimSubmissionPage.getFieldError('incidentDate')).toContainText('Incident date is required');
    await expect(claimSubmissionPage.getFieldError('description')).toContainText('Description is required');
  });

  test('Handle file upload validation', async () => {
    // Act - Try to upload invalid file types
    await claimSubmissionPage.navigateToClaimSubmission();
    await claimSubmissionPage.selectClaimType('Auto');
    
    // Try to upload unsupported file type
    await claimSubmissionPage.uploadDocument('photos', 'test-files/invalid-file.txt');

    // Assert
    await expect(claimSubmissionPage.getUploadError()).toContainText('Invalid file type. Please upload images or PDF files only');
    
    // Try to upload file that's too large
    await claimSubmissionPage.uploadDocument('photos', 'test-files/large-file.zip');
    await expect(claimSubmissionPage.getUploadError()).toContainText('File size exceeds 10MB limit');
  });

  test('Verify policy coverage validation', async () => {
    // Arrange - Use policy with limited coverage
    const limitedCoverageUser = {
      username: 'limited.coverage@email.com',
      password: 'TestPass123!'
    };
    
    await loginPage.logout();
    await loginPage.login(limitedCoverageUser.username, limitedCoverageUser.password);

    const claimData = {
      type: 'Auto',
      subtype: 'Comprehensive',
      incidentType: 'Vandalism',
      amount: 15000.00
    };

    // Act
    await claimSubmissionPage.navigateToClaimSubmission();
    await claimSubmissionPage.selectClaimType(claimData.type);
    await claimSubmissionPage.selectClaimSubtype(claimData.subtype);
    await claimSubmissionPage.enterClaimAmount(claimData.amount);

    // Assert
    await expect(claimSubmissionPage.getCoverageWarning()).toContainText(
      'Your policy has a deductible of $1,000 for comprehensive claims'
    );
    
    const maxCoverage = await claimSubmissionPage.getMaxCoverageAmount();
    expect(Number(maxCoverage)).toBeGreaterThan(claimData.amount);
  });

  test.afterEach(async () => {
    await page.close();
  });
});