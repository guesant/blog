using System.Globalization;
using BlazorBlueprint.Primitives.Extensions;
using Blog.Blazor.Client;
using Blog.Blazor.Core;
using Blog.Blazor.Core.Localization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.JSInterop;
using pax.BlazorChartJs;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.Services.AddLocalization();
builder.Services.AddSingleton<ICultureCatalog, CultureCatalog>();
builder.Services.AddSingleton<ILocalizedUrlBuilder, LocalizedUrlBuilder>();
builder.Services.AddAuthorizationCore();
builder.Services.AddScoped<AuthenticationStateProvider, AnonymousAuthenticationStateProvider>();
builder.Services.AddScoped(_ => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress),
});
builder.Services.AddScoped<IPublicSiteContentProvider, BrowserPublicSiteContentProvider>();
builder.Services.AddScoped<IPublicKnowledgeGraphProvider, BrowserPublicKnowledgeGraphProvider>();
builder.Services.AddScoped<INotFoundResponder, BrowserNotFoundResponder>();
builder.Services.AddChartJs(options =>
    options.ChartJsLocation = "/vendor/chartjs/chart.esm-shim.js"
);
builder.Services.AddBlazorBlueprintPrimitives();
builder.Services.AddScoped<Blog.Blazor.UI.Foundations.SiteToastService>();
builder.Services.AddScoped<Blog.Blazor.UI.Foundations.SiteDialogService>();

var host = builder.Build();

var cultures = host.Services.GetRequiredService<ICultureCatalog>();
var path = new Uri(host.Services.GetRequiredService<NavigationManager>().Uri).AbsolutePath;
var cookieCulture = (
    (IJSInProcessRuntime)host.Services.GetRequiredService<IJSRuntime>()
).Invoke<string?>("blazorCulture.get");
var culture = cultures.Normalize(
    CultureCatalog.HasPortuguesePrefix(path) ? "pt-BR" : cookieCulture
);
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;

await host.RunAsync();
