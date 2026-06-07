using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CnbExchangeApp.Application.Interfaces;

namespace CnbExchangeApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExchangeRateController : ControllerBase
    {
        private readonly ICnbProxyService _proxyService;

        public ExchangeRateController(ICnbProxyService proxyService)
        {
            _proxyService = proxyService;
        }

        [HttpGet("daily")]
        public async Task<IActionResult> GetDailyRates()
        {
            try
            {
                var result = await _proxyService.FetchDailyExchangeRatesAsync();
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, new { error = "Server configuration error.", detail = ex.Message });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, new { error = "Could not reach the CNB upstream service.", detail = ex.Message });
            }
            catch (TimeoutException ex)
            {
                return StatusCode(504, new { error = "The CNB API request timed out.", detail = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An unexpected error occurred.", detail = ex.Message });
            }
        }
    }
}