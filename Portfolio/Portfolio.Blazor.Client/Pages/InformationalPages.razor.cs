using System.Text.Json;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class InformationalPages
{
    protected override void OnParametersSet()
    {
        if (Kind == PageKind.Now)
        {
            Navigation.NavigateTo($"{LocalizedPath("about")}#now", replace: true);
        }
    }

    private PageKind Kind =>
        RequestPath switch
        {
            var path when path.Contains("/portfolio", StringComparison.OrdinalIgnoreCase) =>
                PageKind.Portfolio,
            var path when path.Contains("/now", StringComparison.OrdinalIgnoreCase) => PageKind.Now,
            var path when path.Contains("/license", StringComparison.OrdinalIgnoreCase) =>
                PageKind.License,
            var path when path.Contains("/follow", StringComparison.OrdinalIgnoreCase) =>
                PageKind.Follow,
            _ => PageKind.About,
        };
    private string ApiPageSlug =>
        Kind == PageKind.Now ? NowSlug : Kind.ToString().ToLowerInvariant();
    private string CanonicalPath => RequestPath;
    private string Title =>
        Kind switch
        {
            PageKind.Portfolio => string.Join(
                " · ",
                new[]
                {
                    Snapshot?.Chrome.Profile?.Name,
                    Field("heroIdentity", Snapshot?.Chrome.Profile?.Title ?? string.Empty),
                }.Where(value => !string.IsNullOrWhiteSpace(value))
            ),
            PageKind.Now => L["legacy_ab243226f805"],
            PageKind.License => Field("title"),
            PageKind.Follow => Field("title"),
            _ => Field("title"),
        };
    private string Description =>
        Kind switch
        {
            PageKind.Portfolio => Field("heroExperience"),
            PageKind.Now => L["legacy_95867724f45f"],
            PageKind.Follow => Field("intro"),
            PageKind.License => Field("description"),
            _ => Field("description"),
        };
    private bool HasPortfolioWork =>
        Snapshot?.FeaturedCases is { Count: > 0 }
        || Snapshot?.FeaturedProjects is { Count: > 0 }
        || Snapshot?.Experiments is { Count: > 0 };
    private string? PortfolioWorkTarget =>
        Snapshot?.FeaturedCases is { Count: > 0 } ? "#work"
        : HasPortfolioWork ? "#projects"
        : null;
    private IReadOnlyList<(string Year, string Title, string Description)> ProfileMilestones =>
        Snapshot?.Chrome.Profile?.Milestones is not { ValueKind: JsonValueKind.Array } values
            ? []
            : values
                .EnumerateArray()
                .Where(value =>
                    !value.TryGetProperty("hidden", out var hidden)
                    || hidden.ValueKind != JsonValueKind.True
                )
                .Select(value =>
                    (
                        StringValue(value, "year"),
                        StringValue(value, "title", StringValue(value, "name")),
                        StringValue(value, "description", StringValue(value, "body"))
                    )
                )
                .Where(item =>
                    !string.IsNullOrWhiteSpace(item.Item2) || !string.IsNullOrWhiteSpace(item.Item3)
                )
                .ToArray();

    private sealed record Highlight(string Icon, string Title, string Description, string Href);

    private IReadOnlyList<Highlight> Highlights =>
        [
            new(
                "briefcase",
                L["legacy_3dc269cea284"],
                L["legacy_f45020ee2810"],
                LocalizedUrls.Current("/cases")
            ),
            new(
                "folder-git-2",
                L["legacy_2c505faad45c"],
                L["legacy_9cfc8dff64f5"],
                LocalizedUrls.Current("/projects")
            ),
            new(
                "layout-grid",
                L["about_highlight_portfolio"],
                L["about_highlight_portfolio_description"],
                LocalizedUrls.Current("/portfolio")
            ),
        ];

    private int? Age =>
        DateTime.TryParse(Snapshot?.Chrome.Profile?.BirthDate, out var birth)
            ? Math.Max(
                0,
                DateTime.UtcNow.Year
                    - birth.Year
                    - (
                        DateTime.UtcNow.Date
                        < birth.Date.AddYears(DateTime.UtcNow.Year - birth.Year)
                            ? 1
                            : 0
                    )
            )
            : null;
    private IReadOnlyList<string> PersonalInterestLabels =>
        Snapshot?.Chrome.Profile?.PersonalInterests is not { ValueKind: JsonValueKind.Array } values
            ? []
            : values
                .EnumerateArray()
                .Select(value =>
                    value.ValueKind == JsonValueKind.String
                        ? value.GetString()
                        : StringValue(value, "label")
                )
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Cast<string>()
                .ToArray();

    private string Field(string name, string fallback = "") =>
        SlugField(ApiPageSlug, name, fallback);

    private string SlugField(string slug, string name, string fallback = "")
    {
        if (
            Snapshot?.Pages.TryGetValue(slug, out var page) != true
            || page.ValueKind != JsonValueKind.Object
            || !page.TryGetProperty(name, out var value)
            || value.ValueKind != JsonValueKind.String
        )
            return fallback;
        return value.GetString() ?? fallback;
    }

    private bool HasNowEntries =>
        NowEntries.Any(entry => !string.IsNullOrWhiteSpace(SlugField(NowSlug, entry.Key)));
    private const string NowSlug = "agora";

    private static string StringValue(JsonElement value, string key, string fallback = "") =>
        value.ValueKind == JsonValueKind.Object
        && value.TryGetProperty(key, out var field)
        && field.ValueKind == JsonValueKind.String
            ? field.GetString() ?? fallback
            : fallback;

    private static string? SafeUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https"
            ? uri.AbsoluteUri
            : null;

    private IReadOnlyList<(string Key, string Label)> NowEntries =>
        [
            ("trabalhando", L["working_on"]),
            ("construindo", L["building"]),
            ("estudando", L["studying"]),
            ("lendo", L["reading"]),
            ("ouvindo", L["listening_to"]),
            ("assistindo", L["watching"]),
        ];
    private static IReadOnlyList<(string Heading, string Body)> LicenseEntries =>
        [
            ("code_heading", "code_body"),
            ("content_heading", "content_body"),
            ("ai_heading", "ai_body"),
        ];
    private IReadOnlyList<(string Title, string Description, string? Url)> FollowEntries =>
        [
            ("rss_title", "rss_description", L["legacy_362d5aad99f1"]),
            ("atom_title", "atom_description", L["legacy_eabac209b499"]),
            ("jsonfeed_title", "jsonfeed_description", L["legacy_02f8bdc0b350"]),
            ("api_title", "api_description", "/api/v1/findings"),
            ("sitemap_title", "sitemap_description", "/sitemap.xml"),
            ("robots_title", "robots_description", "/robots.txt"),
            ("webfinger_title", "webfinger_description", null),
        ];
    private static IReadOnlyList<(string Title, string Description)> FutureFollowEntries =>
        [
            ("activitypub_title", "activitypub_description"),
            ("websub_title", "websub_description"),
            ("webmention_title", "webmention_description"),
        ];

    private static string LocalizedUrl(string url)
    {
        var path = new Uri(url).AbsolutePath;
        return LocalizedUrls.Current(path);
    }

    private static string LocalizedPath(string path) => LocalizedUrls.Current($"/{path}");

    private enum PageKind
    {
        About,
        Portfolio,
        Now,
        License,
        Follow,
    }
}
