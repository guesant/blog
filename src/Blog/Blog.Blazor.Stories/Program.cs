using BlazorBlueprint.Primitives.Extensions;
using Blog.Blazor.Stories;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddLocalization();
builder.Services.AddBlazorBlueprintPrimitives();
builder.Services.AddScoped<Blog.Blazor.UI.Foundations.SiteToastService>();
builder.Services.AddScoped<Blog.Blazor.UI.Foundations.SiteDialogService>();
builder.Services.AddScoped(_ => new HttpClient
{
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress),
});

await builder.Build().RunAsync();
