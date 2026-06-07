using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace CnbExchangeApp.Domain.Entities
{
    public class CnbResponse
    {
        [JsonPropertyName("rates")]
        public List<CnbRate> Rates { get; set; } = new();
    }

    public class CnbRate
    {
        [JsonPropertyName("country")]
        public string Country { get; set; } = string.Empty;

        [JsonPropertyName("currency")]
        public string Currency { get; set; } = string.Empty;

        [JsonPropertyName("amount")]
        public int Amount { get; set; }

        [JsonPropertyName("currencyCode")]
        public string CurrencyCode { get; set; } = string.Empty;

        [JsonPropertyName("rate")]
        public decimal Rate { get; set; }
    }
}