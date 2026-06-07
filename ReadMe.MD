# 💱 CNB Currency Exchange Dashboard

A web application that fetches live daily exchange rates from the **Czech National Bank (CNB)** public API and presents them with a searchable rates table and an interactive currency converter.

Built as part of a **Junior–Medior Fullstack Developer Technical Assessment**.


---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19 (Standalone Components) |
| Backend | ASP.NET Core Web API (.NET 10) |
| Architecture | Clean Architecture (Domain / Application / Infrastructure / API) |
| Backend Testing | xUnit + Moq |
| Frontend Testing | Jasmine + Karma |
| External Data | Czech National Bank REST API |

---

## ✨ Features

- 📊 Live exchange rates table fetched from the CNB public API
- 🔍 Search and filter rates by currency name, code, or country
- 🔄 Currency converter — convert CZK to foreign currency or vice versa
- 🌐 CORS-enabled backend ready for local frontend integration
- ⏳ Loading indicators while data is being fetched
- ⚠️ User-visible error banners when the backend is unreachable
- ✅ Unit tested — .NET controller (xUnit + Moq) and Angular components (Jasmine + Karma)

---

## 📁 Project Structure

```
CNBRate_WebApp/
├── Backend/
│   └── CnbExchangeApp/
│       ├── CnbExchange.Domain/             # Data models (CnbRate, CnbResponse)
│       ├── CnbExchange.Application/        # Interfaces / contracts (ICnbProxyService)
│       ├── CnbExchange.Infrastructure/     # HTTP service (CnbProxyService)
│       ├── CnbExchangeApp.API/             # Controllers, Program.cs, appsettings
│       └── CnbExchangeApp.Tests/           # xUnit unit tests with Moq
│
└── Frontend/
    └── src/app/
        ├── components/
        │   ├── rates-table/                # Exchange rates display with search filter
        │   └── currency-converter/         # CZK ↔ foreign currency calculator
        ├── services/                       # CnbExchangeService (HttpClient calls)
        └── models/                         # TypeScript interfaces (CnbRate, CnbResponse)
```

---

## 🔗 API Endpoint

The backend acts as a **proxy** between the Angular frontend and the CNB public API.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/ExchangeRate/daily` | Returns today's exchange rates as JSON |

**External CNB source URL:**
```
https://api.cnb.cz/cnbapi/exrates/daily?lang=EN&accept=application/json
```

---

## 🚀 Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Angular CLI](https://angular.io/cli) — `npm install -g @angular/cli`
- Visual Studio 2022 (recommended for backend)

---

### ▶️ Run the Backend

**Option A — Visual Studio**
1. Open `Backend/CnbExchangeApp/CnbExchangeApp.slnx` in Visual Studio 2022
2. Set `CnbExchangeApp.API` as the startup project
3. Press **F5** or click the run button / ng serve

**Option B — Terminal**
```cmd
cd Backend/CnbExchangeApp/CnbExchangeApp.API
dotnet run 

alternative to run backend:
dotnet run --project CnbExchangeApp.API
```

The API will start at: **http://localhost:5141**

---

### ▶️ Run the Frontend

```cmd
cd Frontend

# First time only — install dependencies
npm install

# Start the dev server
npm start
```

The app will be available at: **http://localhost:4200**

> ⚠️ The backend must be running before the frontend will display any data.

---

### 🧪 Run the Tests

**Backend (.NET)**
```cmd
cd Backend/CnbExchangeApp
dotnet test
```
Or use the **Test Explorer** panel inside Visual Studio.

**Frontend (Angular)**
```cmd
cd Frontend
ng test --no-watch --browsers ChromeHeadless
```
Or simply:
```cmd
ng test
```
This runs all Jasmine/Karma tests — `AppComponent`, `RatesTableComponent`, and `CurrencyConverterComponent` specs.

---

## 🏗️ Architecture Overview

The backend follows **Clean Architecture** — each layer has a single responsibility and dependencies only point inward.

```
Angular Frontend (port 4200)
        │
        │  HTTP GET /api/ExchangeRate/daily
        ▼
CnbExchangeApp.API          ← Receives HTTP requests, returns JSON
        │
        ▼
CnbExchange.Application     ← Defines the ICnbProxyService interface (contract)
        │
        ▼
CnbExchange.Infrastructure  ← Implements the contract, calls CNB external API
        │
        ▼
CnbExchange.Domain          ← Plain C# models (CnbRate, CnbResponse)
        │
        ▼
CNB Public API (internet)   ← https://api.cnb.cz/...
```

---

## 🔧 Configuration

Backend URL and external API settings are stored in `appsettings.json` — no hardcoded values in code:

```json
{
  "ExternalApis": {
    "CnbDailyRatesUrl": "https://api.cnb.cz/cnbapi/exrates/daily?lang=EN&accept=application/json"
  }
}
```

CORS is configured in `Program.cs` to allow requests from `http://localhost:4200`.

---

## 📐 Development Process

```
CNB API Research → Domain Models → Application Interface → Infrastructure Service
      → API Controller → Program.cs Wiring → Unit Tests → Angular Service
      → Rates Table Component → Currency Converter Component → Integration Testing
```

---

## 🛡️ Error Handling

**Backend (.NET)**
- `CnbProxyService` wraps the HTTP call in a `try/catch` block
- `HttpRequestException` → returns HTTP `502 Bad Gateway` (CNB unreachable)
- `TaskCanceledException` → returns HTTP `504 Gateway Timeout`
- `InvalidOperationException` → returns HTTP `500` (missing config)
- All errors return a structured JSON body: `{ "error": "...", "detail": "..." }`

**Frontend (Angular)**
- Both components show a `⏳ Loading...` indicator while the request is in flight
- If the request fails, a visible red error banner is shown to the user
- The table and converter are hidden until data loads successfully
- Empty search results show a "No results match your search" message

---

## 📝 Developer Notes & Assumptions

- The CNB public API (`api.cnb.cz`) does not require authentication — it is freely accessible
- Exchange rates are fetched fresh on every request (no caching implemented)
- The CNB API returns rates relative to CZK — e.g., `rate: 25.12` for EUR means 1 EUR = 25.12 CZK. The `amount` field accounts for currencies priced per 100 units (e.g., JPY)
- The backend acts as a **proxy** — this avoids CORS issues that would occur if Angular called the CNB API directly from the browser
- The frontend API URL is configured via Angular's `environment.ts` file — no hardcoded URLs in service classes
- `.NET 10` was used (latest available at time of development). The assessment suggested .NET 6/7/8 but .NET 10 is fully compatible and forward-looking
- `IHttpClientFactory` is used instead of `new HttpClient()` to follow best practices and avoid socket exhaustion
- Both Angular components load independently — they each make their own service call rather than sharing state through a parent component
- The `.http` file in the API project still contains the default `/weatherforecast` route from the Visual Studio template — it is not used and can be ignored or updated to `/api/ExchangeRate/daily`
