using CnbExchangeApp.Application.Interfaces;
using CnbExchangeApp.Infrastructure.Services;

namespace CnbExchangeApp.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Standard Framework Engines
            builder.Services.AddControllers();
            builder.Services.AddHttpClient(); // Required for your proxy's IHttpClientFactory!
            builder.Services.AddOpenApi();

            // 2. Map Interface to Concrete Class (Fixes the runtime dependency crash)
            builder.Services.AddScoped<ICnbProxyService, CnbProxyService>();

            // 3. Configure CORS Permissions for your Angular application
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularFrontend", policy =>
                {
                    // Read allowed origins from environment variable (comma-separated) or fall back to localhost
                    var allowedOrigins = builder.Configuration["AllowedCorsOrigins"]
                        ?? Environment.GetEnvironmentVariable("ALLOWED_CORS_ORIGINS")
                        ?? "http://localhost:4200";

                    policy.WithOrigins(allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            // 4. Activate the CORS Policy Middleware BEFORE MapControllers
            app.UseCors("AllowAngularFrontend");

            // Optional: Comment this out if you're experiencing HTTPS redirection port warnings locally
            // app.UseHttpsRedirection(); 

            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}