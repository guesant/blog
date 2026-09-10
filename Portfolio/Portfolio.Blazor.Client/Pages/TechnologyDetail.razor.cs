using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class TechnologyDetail
{
    [Parameter]
    public string Slug { get; set; } = string.Empty;
    private PublicTechnology? Technology =>
        Snapshot?.Technologies.FirstOrDefault(item =>
            PublicRouteKey.Matches(item.Url, item.Slug, Slug)
        );
    private IReadOnlyList<PublicCaseStudy> RelatedCases =>
        Snapshot
            ?.Cases.Where(item =>
                item.Technologies?.Any(technology =>
                    technology.Slug.Equals(ResolvedSlug, StringComparison.OrdinalIgnoreCase)
                ) == true
            )
            .ToArray()
        ?? [];
    private IReadOnlyList<PublicProject> RelatedProjects =>
        Snapshot
            ?.Projects.Where(item =>
                item.Technologies?.Any(technology =>
                    technology.Slug.Equals(ResolvedSlug, StringComparison.OrdinalIgnoreCase)
                ) == true
            )
            .ToArray()
        ?? [];
    private IReadOnlyList<PublicExperiment> RelatedExperiments =>
        Snapshot
            ?.Experiments.Where(item =>
                item.Technologies?.Any(technology =>
                    technology.Slug.Equals(ResolvedSlug, StringComparison.OrdinalIgnoreCase)
                ) == true
            )
            .ToArray()
        ?? [];
    private bool IsEmpty =>
        RelatedCases.Count == 0
        && RelatedProjects.Count == 0
        && RelatedExperiments.Count == 0
        && (Technology?.ResumeSkills?.Count ?? 0) == 0;
    private string ResolvedSlug => Technology?.Slug ?? Slug;
    private string Title => Technology?.Name ?? Slug;
    private string Description => L["browse_technology", Title];
    private string CanonicalPath => Technology?.Url ?? RequestPath;
    private string LoadingLabel => L["legacy_f8d5af569106"];
    private string EmptyLabel => L["legacy_12d8890036fa"];
    private string NotFoundLabel => L["legacy_68634914bbd9"];
    private string NotFoundDescription => L["legacy_9883512f7345"];
    private string BackLabel => L["legacy_6e8c2cd0b9b6"];
    private string IndexUrl => LocalizedPath("technologies");
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(L["legacy_b4e2241909e0"], IndexUrl)];

    private static string Short(string value) =>
        value.Length > 150 ? value[..150].TrimEnd() + "…" : value;

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L["legacy_0607643fd42c"])
            : (LocalizedUrls.Current($"/{path}"));

    private static string LocalizedUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }
}
