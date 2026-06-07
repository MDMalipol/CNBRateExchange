import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { CnbExchangeService } from './services/cnb-exchange.services';

// Provide a mock so child components don't trigger real HTTP calls
const mockExchangeService = {
  getDailyExchangeRates: jasmine.createSpy('getDailyExchangeRates').and.returnValue(
    of({ rates: [] })
  )
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: CnbExchangeService, useValue: mockExchangeService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('cnb-exchange-ui');
  });

  it('should render the rates table and converter containers', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-rates-table')).toBeTruthy();
    expect(compiled.querySelector('app-currency-converter')).toBeTruthy();
  });
});
