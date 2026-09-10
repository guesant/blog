using BlazorBlueprint.Primitives.Extensions;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Portfolio.Blazor.Stories;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddBlazorBlueprintPrimitives();
builder.Services.AddScoped<Portfolio.Blazor.UI.Foundations.SiteToastService>();
builder.Services.AddScoped<Portfolio.Blazor.UI.Foundations.SiteDialogService>();
builder.Services.AddScoped(_ => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress),
});

await builder.Build().RunAsync();
