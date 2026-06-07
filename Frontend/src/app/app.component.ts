import { Component } from '@angular/core';
import { RatesTableComponent } from './components/rates-table/rates-table.component';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RatesTableComponent, CurrencyConverterComponent], // Registers our feature blocks
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cnb-exchange-ui';
}