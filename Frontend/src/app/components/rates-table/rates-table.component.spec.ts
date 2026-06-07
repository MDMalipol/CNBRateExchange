import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RatesTableComponent } from './rates-table.component';
import { CnbExchangeService } from '../../services/cnb-exchange.services';

// Sample mock data used across tests
const mockRatesResponse = {
  rates: [
    { country: 'Eurozone', currency: 'Euro',   amount: 1,   currencyCode: 'EUR', rate: 25.12 },
    { country: 'USA',      currency: 'Dollar', amount: 1,   currencyCode: 'USD', rate: 23.45 },
    { country: 'Japan',    currency: 'Yen',    amount: 100, currencyCode: 'JPY', rate: 15.80 }
  ]
};

describe('RatesTableComponent', () => {
  let component: RatesTableComponent;
  let fixture: ComponentFixture<RatesTableComponent>;
  let mockService: jasmine.SpyObj<CnbExchangeService>;

  beforeEach(async () => {
    // Create a fresh spy object before every single test
    mockService = jasmine.createSpyObj<CnbExchangeService>('CnbExchangeService', [
      'getDailyExchangeRates'
    ]);

    // Default: return success response
    mockService.getDailyExchangeRates.and.returnValue(of(mockRatesResponse));

    await TestBed.configureTestingModule({
      imports: [RatesTableComponent], // Standalone component — already has CommonModule + FormsModule
      providers: [
        { provide: CnbExchangeService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ── Data Loading ──────────────────────────────────────────────────────────

  it('should load all rates on init', () => {
    expect(component.ratesList.length).toBe(3);
    expect(component.filteredRates.length).toBe(3);
  });

  it('should set isLoading to false after data loads', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should have no error message on successful load', () => {
    expect(component.errorMessage).toBe('');
  });

  // ── Search / Filter ───────────────────────────────────────────────────────

  it('should filter rates by currency name (case-insensitive)', () => {
    component.searchQuery = 'euro';
    component.applyFilter();
    expect(component.filteredRates.length).toBe(1);
    expect(component.filteredRates[0].currencyCode).toBe('EUR');
  });

  it('should filter rates by currency code', () => {
    component.searchQuery = 'USD';
    component.applyFilter();
    expect(component.filteredRates.length).toBe(1);
    expect(component.filteredRates[0].country).toBe('USA');
  });

  it('should filter rates by country name (case-insensitive)', () => {
    component.searchQuery = 'japan';
    component.applyFilter();
    expect(component.filteredRates.length).toBe(1);
    expect(component.filteredRates[0].currencyCode).toBe('JPY');
  });

  it('should return all rates when search query is cleared', () => {
    component.searchQuery = 'euro';
    component.applyFilter();
    expect(component.filteredRates.length).toBe(1);

    component.searchQuery = '';
    component.applyFilter();
    expect(component.filteredRates.length).toBe(3);
  });

  it('should return empty list when no rates match the search', () => {
    component.searchQuery = 'zzznomatch';
    component.applyFilter();
    expect(component.filteredRates.length).toBe(0);
  });

  // ── Error Handling ────────────────────────────────────────────────────────

  it('should show error message when service call fails', async () => {
    // Override mock to return an error for this specific test
    mockService.getDailyExchangeRates.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    // Re-create the component so ngOnInit runs with the new failing mock
    fixture = TestBed.createComponent(RatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.errorMessage).toContain('Failed to load exchange rates');
    expect(component.isLoading).toBeFalse();
    expect(component.ratesList.length).toBe(0);
  });

  it('should call getDailyExchangeRates exactly once on init', () => {
    expect(mockService.getDailyExchangeRates).toHaveBeenCalledTimes(1);
  });
});
