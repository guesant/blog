using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core.Localization;

namespace Portfolio.Blazor.Components;

public partial class App
{
    [Inject]
    private NavigationManager Navigation { get; set; } = default!;

    private IComponentRenderMode? PageRenderMode
    {
        get
        {
            var path = new Uri(Navigation.Uri).AbsolutePath;
            var isAdminRoute =
                path.StartsWith("/admin", StringComparison.OrdinalIgnoreCase)
                && !path.Equals("/admin/login", StringComparison.OrdinalIgnoreCase);
            if (isAdminRoute)
                return InteractiveServer;

            var unlocalizedPath = path.StartsWith("/pt-BR", StringComparison.OrdinalIgnoreCase)
                ? path[6..]
                : path;
            if (string.IsNullOrEmpty(unlocalizedPath))
                unlocalizedPath = "/";
            var isToolRoute =
                path.Equals("/tools", StringComparison.OrdinalIgnoreCase)
                || path.Equals("/pt-BR/tools", StringComparison.OrdinalIgnoreCase)
                || path.StartsWith("/tools/", StringComparison.OrdinalIgnoreCase)
                || path.StartsWith("/pt-BR/tools/", StringComparison.OrdinalIgnoreCase)
                || path.Equals("/findings", StringComparison.OrdinalIgnoreCase)
                || path.StartsWith("/findings/", StringComparison.OrdinalIgnoreCase)
                || path.Equals("/pt-BR/findings", StringComparison.OrdinalIgnoreCase)
                || path.StartsWith("/pt-BR/findings/", StringComparison.OrdinalIgnoreCase);
            var isInteractiveListing =
                unlocalizedPath
                is "/"
                    or "/writing"
                    or "/projects"
                    or "/cases"
                    or "/collections"
                    or "/topics"
                    or "/technologies"
                    or "/snippets"
                    or "/credits";

            return isToolRoute || isInteractiveListing ? InteractiveWebAssembly : null;
        }
    }

    private string DocumentLanguage => Cultures.Normalize(CultureInfo.CurrentUICulture.Name).Name;
    private string SkipToContentLabel => L["skip_to_content"];

    protected override async Task OnInitializedAsync()
    {
        var snapshot = await ContentProvider.GetAsync(DocumentLanguage);
        if (
            snapshot?.Chrome.Site.MaintenanceEnabled == true
            && HttpContextAccessor.HttpContext is { Response.HasStarted: false } context
        )
        {
            context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
            context.Response.Headers.RetryAfter = "3600";
        }
    }
}
