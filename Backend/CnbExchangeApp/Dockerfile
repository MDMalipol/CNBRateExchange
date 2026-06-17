FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["CnbExchangeApp.API/CnbExchangeApp.Api.csproj", "CnbExchangeApp.API/"]
COPY ["CnbExchange.Application/CnbExchangeApp.Application.csproj", "CnbExchange.Application/"]
COPY ["CnbExchange.Infrastructure/CnbExchangeApp.Infrastructure.csproj", "CnbExchange.Infrastructure/"]
COPY ["CnbExchange.Domain/CnbExchangeApp.Domain.csproj", "CnbExchange.Domain/"]
RUN dotnet restore "CnbExchangeApp.API/CnbExchangeApp.Api.csproj"
COPY . .
RUN dotnet publish "CnbExchangeApp.API/CnbExchangeApp.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "CnbExchangeApp.Api.dll"]
