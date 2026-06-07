import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CnbExchangeService } from '../../services/cnb-exchange.services';

@Component({
  selector: 'app-rates-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rates-table.component.html',
  styleUrl: './rates-table.component.css'
})
export class RatesTableComponent implements OnInit {
  ratesList: any[] = [];
  filteredRates: any[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private readonly exchangeService: CnbExchangeService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.exchangeService.getDailyExchangeRates().subscribe({
      next: (response: any) => {
        this.ratesList = response.rates || [];
        this.filteredRates = response.rates || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Table fetch failed:', err);
        this.errorMessage = 'Failed to load exchange rates. Please make sure the backend is running and try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredRates = this.ratesList;
      return;
    }
    this.filteredRates = this.ratesList.filter(r =>
      r.currency?.toLowerCase().includes(query) ||
      r.currencyCode?.toLowerCase().includes(query) ||
      r.country?.toLowerCase().includes(query)
    );
  }
}
