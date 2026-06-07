export interface CnbResponse {
  rates: CnbRate[];
}

export interface CnbRate {
  country: string;
  currency: string;
  amount: number;
  currencyCode: string;
  rate: number;
}