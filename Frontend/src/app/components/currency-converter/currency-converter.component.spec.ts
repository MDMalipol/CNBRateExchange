import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CurrencyConverterComponent } from './currency-converter.component';
import { CnbExchangeService } from '../../services/cnb-exchange.services';

// Round numbers used to make expected results easy to verify mentally
const mockRatesResponse = {
  rates: [
    { country: 'Eurozone', currency: 'Euro',   amount: 1,   currencyCode: 'EUR', rate: 25.00 },
    { country: 'USA',      currency: 'Dollar', amount: 1,   currencyCode: 'USD', rate: 20.00 },
    { country: 'Japan',    currency: 'Yen',    amount: 100, currencyCode: 'JPY', rate: 10.00 }
  ]
};

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let mockService: jasmine.SpyObj<CnbExchangeService>;

  beforeEach(async () => {
    // Create a fresh spy object before every single test
    mockService = jasmine.createSpyObj<CnbExchangeService>('CnbExchangeService', [
      'getDailyExchangeRates'
    ]);

    // Default: return success response
    mockService.getDailyExchangeRates.and.returnValue(of(mockRatesResponse));

    await TestBed.configureTestingModule({
      imports: [CurrencyConverterComponent], // Standalone — already has CommonModule + FormsModule
      providers: [
        { provide: CnbExchangeService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ── Data Loading ──────────────────────────────────────────────────────────

  it('should load rates on init', () => {
    expect(component.ratesList.length).toBe(3);
  });

  it('should set isLoading to false after data loads', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should have no error message on successful load', () => {
    expect(component.errorMessage).toBe('');
  });

  it('should call getDailyExchangeRates exactly once on init', () => {
    expect(mockService.getDailyExchangeRates).toHaveBeenCalledTimes(1);
  });

  // ── Conversion Logic — CZK to Foreign (fromCzk) ──────────────────────────

  it('should convert CZK → EUR correctly', () => {
    // EUR rate=25, amount=1 → 1 EUR = 25 CZK
    // 100 CZK ÷ 25 = 4 EUR
    component.selectedCurrencyCode = 'EUR';
    component.amountToConvert = 100;
    component.conversionDirection = 'fromCzk';
    component.calculateConversion();
    expect(component.calculatedResult).toBeCloseTo(4, 2);
  });

  it('should convert CZK → USD correctly', () => {
    // USD rate=20, amount=1 → 1 USD = 20 CZK
    // 100 CZK ÷ 20 = 5 USD
    component.selectedCurrencyCode = 'USD';
    component.amountToConvert = 100;
    component.conversionDirection = 'fromCzk';
    component.calculateConversion();
    expect(component.calculatedResult).toBeCloseTo(5, 2);
  });

  it('should convert CZK → JPY correctly (amount=100 unit currency)', () => {
    // JPY rate=10 per 100 units → 1 JPY = 0.10 CZK
    // 100 CZK ÷ 0.10 = 1000 JPY
    component.selectedCurrencyCode = 'JPY';
    component.amountToConvert = 100;
    component.conversionDirection = 'fromCzk';
    component.calculateConversion();
    expect(component.calculatedResult).toBeCloseTo(1000, 2);
  });

  // ── Conversion Logic — Foreign to CZK (toCzk) ────────────────────────────

  it('should convert EUR → CZK correctly', () => {
    // EUR rate=25, amount=1 → 1 EUR = 25 CZK
    // 4 EUR × 25 = 100 CZK
    component.selectedCurrencyCode = 'EUR';
    component.amountToConvert = 4;
    component.conversionDirection = 'toCzk';
    component.calculateConversion();
    expect(component.calculatedResult).toBeCloseTo(100, 2);
  });

  it('should convert JPY → CZK correctly (amount=100 unit currency)', () => {
    // JPY rate=10 per 100 → 1 JPY = 0.10 CZK
    // 1000 JPY × 0.10 = 100 CZK
    component.selectedCurrencyCode = 'JPY';
    component.amountToConvert = 1000;
    component.conversionDirection = 'toCzk';
    component.calculateConversion();
    expect(component.calculatedResult).toBeCloseTo(100, 2);
  });

  // ── Edge Cases ────────────────────────────────────────────────────────────

  it('should return 0 when amount is 0', () => {
    component.selectedCurrencyCode = 'EUR';
    component.amountToConvert = 0;
    component.calculateConversion();
    expect(component.calculatedResult).toBe(0);
  });

  it('should return 0 when amount is negative', () => {
    component.selectedCurrencyCode = 'EUR';
    component.amountToConvert = -50;
    component.calculateConversion();
    expect(component.calculatedResult).toBe(0);
  });

  it('should return 0 when selected currency code does not exist in the list', () => {
    component.selectedCurrencyCode = 'XYZ';
    component.amountToConvert = 100;
    component.calculateConversion();
    expect(component.calculatedResult).toBe(0);
  });

  // ── Error Handling ────────────────────────────────────────────────────────

  it('should show error message when service call fails', () => {
    // Override mock to return an error for this specific test
    mockService.getDailyExchangeRates.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    // Re-create component so ngOnInit runs with the failing mock
    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.errorMessage).toContain('Could not load currency data');
    expect(component.isLoading).toBeFalse();
    expect(component.ratesList.length).toBe(0);
  });
});
