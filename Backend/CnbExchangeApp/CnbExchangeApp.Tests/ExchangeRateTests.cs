using Xunit;
using Moq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using CnbExchangeApp.Application.Interfaces;
using CnbExchangeApp.Domain.Entities;
using CnbExchangeApp.Api.Controllers;


namespace CnbExchangeApp.Tests
{
    public class ExchangeRateTests
    {
        [Fact]
        public async Task GetDailyRates_ReturnsOkStatus_WithValidMockedPayload()
        {
            // 1. ARRANGE: Build a safe, fake execution environment using interface contracts
            var mockProxyService = new Mock<ICnbProxyService>();

            var expectedResponse = new CnbResponse
            {
                Rates = new List<CnbRate>
                {
                    new CnbRate { Country = "Eurozone", Currency = "Euro", Amount = 1, CurrencyCode = "EUR", Rate = 25.120m },
                    new CnbRate { Country = "USA", Currency = "Dollar", Amount = 1, CurrencyCode = "USD", Rate = 23.450m }
                }
            };

            // Program your Moq engine to return your expected data loop instantly when invoked
            mockProxyService
                .Setup(service => service.FetchDailyExchangeRatesAsync())
                .ReturnsAsync(expectedResponse);

            // Inject the mocked service object straight into your controller instance
            var controller = new ExchangeRateController(mockProxyService.Object);

            // 2. ACT: Invoke your controller route endpoint method directly
            var actionResult = await controller.GetDailyRates();

            // 3. ASSERT: Graphically verify that your data processing rules are 100% correct
            var okResult = Assert.IsType<OkObjectResult>(actionResult);
            var actualResponse = Assert.IsType<CnbResponse>(okResult.Value);

            Assert.Equal(2, actualResponse.Rates.Count);
            Assert.Equal("EUR", actualResponse.Rates[0].CurrencyCode);
            Assert.Equal(25.120m, actualResponse.Rates[0].Rate);
        }
    }
}