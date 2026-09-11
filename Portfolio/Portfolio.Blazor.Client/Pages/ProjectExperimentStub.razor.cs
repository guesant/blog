using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class ProjectExperimentStub
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private PublicExperiment? Experiment =>
        Snapshot?.Experiments.FirstOrDefault(item =>
            PublicRouteKey.Matches(item.Url, item.Slug, Slug)
        );
    private string Title => Experiment?.Name ?? Slug.Replace('-', ' ');
    private string Description => Experiment?.Purpose ?? NotFoundDescription;
    private string? PublishedAt => Experiment?.PublishedAt;
    private string CanonicalPath => Experiment?.Url ?? RequestPath;
    private string NotFoundDescription => L["legacy_e74a35c6bf2d"];
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [
            new(CrumbLabel("portfolio", L["legacy_5c816876b410"]), LocalizedPath("portfolio")),
            new(CrumbLabel("projects", L["legacy_2c505faad45c"]), LocalizedPath("projects")),
        ];

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L["legacy_0607643fd42c"])
            : (LocalizedUrls.Current($"/{path}"));
}
