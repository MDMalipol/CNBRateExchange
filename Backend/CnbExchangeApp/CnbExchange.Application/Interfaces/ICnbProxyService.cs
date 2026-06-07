using System.Threading.Tasks;
using CnbExchangeApp.Domain.Entities;

namespace CnbExchangeApp.Application.Interfaces
{
    public interface ICnbProxyService
    {
        Task<CnbResponse> FetchDailyExchangeRatesAsync();
    }
}