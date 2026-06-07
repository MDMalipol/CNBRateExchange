using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using CnbExchangeApp.Application.Interfaces;
using CnbExchangeApp.Domain.Entities;

namespace CnbExchangeApp.Infrastructure.Services
{
    public class CnbProxyService : ICnbProxyService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public CnbProxyService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _config = configuration;
        }

        public async Task<CnbResponse> FetchDailyExchangeRatesAsync()
        {
            var client = _httpClientFactory.CreateClient();

            // Reads our routing URL path dynamically from our appsettings configuration file
            string? targetUrl = _config["ExternalApis:CnbDailyRatesUrl"];

            if (string.IsNullOrEmpty(targetUrl))
                throw new InvalidOperationException("CNB API URL is not configured. Check ExternalApis:CnbDailyRatesUrl in appsettings.json.");

            try
            {
                var response = await client.GetAsync(targetUrl);
                response.EnsureSuccessStatusCode();

                // Extension method handles JSON parsing automatically from System.Net.Http.Json
                var data = await response.Content.ReadFromJsonAsync<CnbResponse>();
                return data ?? new CnbResponse();
            }
            catch (HttpRequestException ex)
            {
                throw new HttpRequestException($"Failed to reach the CNB API at '{targetUrl}'. The upstream service may be unavailable.", ex);
            }
            catch (TaskCanceledException ex)
            {
                throw new TimeoutException("The request to the CNB API timed out. Please try again.", ex);
            }
        }
    }
}