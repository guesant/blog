using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

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
    private string LoadingLabel => L["browse_cases_projects_and_experiments_using"];
    private string EmptyLabel => L["loading_technology"];
    private string NotFoundLabel => L["no_content_is_currently_published_using_this"];
    private string NotFoundDescription => L["technology_not_found"];
    private string BackLabel => L["this_address_does_not_match_a_public_technology"];
    private string IndexUrl => LocalizedPath("technologies");
    private IReadOnlyList<BreadcrumbLink> BreadcrumbLinks =>
        [new(CrumbLabel("technologies", L["technologies"]), IndexUrl)];

    private string LocalizedPath(string path) =>
        path.Equals("home", StringComparison.OrdinalIgnoreCase)
            ? (L[""])
            : (LocalizedUrls.Current($"/{path}"));

    private static string LocalizedUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var absolute))
            return url;
        var path = absolute.AbsolutePath;
        return LocalizedUrls.Current(path);
    }
}
