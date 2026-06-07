import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CnbExchangeService } from '../../services/cnb-exchange.services';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.css'
})
export class CurrencyConverterComponent implements OnInit {
  ratesList: any[] = [];
  amountToConvert: number = 100;
  selectedCurrencyCode: string = 'EUR';
  conversionDirection: 'toCzk' | 'fromCzk' = 'fromCzk';
  calculatedResult: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private readonly exchangeService: CnbExchangeService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.exchangeService.getDailyExchangeRates().subscribe({
      next: (response: any) => {
        this.ratesList = response.rates || [];
        this.isLoading = false;
        this.calculateConversion();
      },
      error: (err: any) => {
        console.error('Converter fetch failed:', err);
        this.errorMessage = 'Could not load currency data. Please make sure the backend is running.';
        this.isLoading = false;
      }
    });
  }

  calculateConversion(): void {
    const selectedRate = this.ratesList.find(r => r.currencyCode === this.selectedCurrencyCode);
    if (!selectedRate || this.amountToConvert <= 0) {
      this.calculatedResult = 0;
      return;
    }

    const ratePerSingleUnit = selectedRate.rate / selectedRate.amount;
    if (this.conversionDirection === 'fromCzk') {
      this.calculatedResult = this.amountToConvert / ratePerSingleUnit;
    } else {
      this.calculatedResult = this.amountToConvert * ratePerSingleUnit;
    }
  }
}
