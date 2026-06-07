import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CnbExchangeService {
  // URL is read from environment config — not hardcoded
  private readonly apiUrl = `${environment.apiUrl}/ExchangeRate/daily`;

  constructor(private readonly http: HttpClient) {}

  getDailyExchangeRates(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
