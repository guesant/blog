using Microsoft.AspNetCore.Localization;
using Portfolio.Blazor.Core.Localization;

namespace Portfolio.Blazor;

public sealed class PathRequestCultureProvider(ICultureCatalog cultures) : RequestCultureProvider
{
    public override Task<ProviderCultureResult?> DetermineProviderCultureResult(
        HttpContext httpContext
    )
    {
        var culture = cultures.FromPath(httpContext.Request.Path).Name;
        var explicitLocale = httpContext.Request.Path.StartsWithSegments(
            "/pt-BR",
            StringComparison.OrdinalIgnoreCase
        );
        return Task.FromResult<ProviderCultureResult?>(
            explicitLocale ? new ProviderCultureResult(culture, culture) : null
        );
    }
}
