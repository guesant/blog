using System.Globalization;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core.Localization;

namespace Portfolio.Blazor.Client;

public abstract class LocalizedComponentBase : ComponentBase
{
    [Inject]
    protected NavigationManager Navigation { get; set; } = default!;

    [Inject]
    protected IStringLocalizer<SharedResource> L { get; set; } = default!;

    [Inject]
    protected IStringLocalizer<ToolsResource> ToolsL { get; set; } = default!;

    protected static string CurrentLocale =>
        CultureCatalog.NormalizeName(CultureInfo.CurrentUICulture.Name);

    protected string RequestPath => new Uri(Navigation.Uri).AbsolutePath;

    protected string RequestRouteSegment(string fallback) =>
        RequestPath.TrimEnd('/').Split('/', StringSplitOptions.RemoveEmptyEntries).LastOrDefault()
        ?? fallback;

    protected static bool IsCulture(string culture) =>
        CultureCatalog
            .NormalizeName(CurrentLocale)
            .Equals(CultureCatalog.NormalizeName(culture), StringComparison.OrdinalIgnoreCase);
}
