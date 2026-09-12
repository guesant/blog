using Blog.Blazor.Core.Localization;
using Microsoft.AspNetCore.Localization;

namespace Blog.Blazor;

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
