using System.Globalization;
using Blog.Blazor.Core.Localization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;

namespace Blog.Blazor.Components;

public partial class App
{
    [Inject]
    private NavigationManager Navigation { get; set; } = default!;

    private IComponentRenderMode? PageRenderMode
    {
        get
        {
            var path = new Uri(Navigation.Uri).AbsolutePath;
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
