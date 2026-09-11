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
    private string NotFoundDescription => L["this_address_does_not_match_a_public_experiment"];
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [
            new(CrumbLabel("portfolio", L["portfolio"]), LocalizedPath("portfolio")),
            new(CrumbLabel("projects", L["projects"]), LocalizedPath("projects")),
        ];

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L[""])
            : (LocalizedUrls.Current($"/{path}"));
}
