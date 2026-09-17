using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public partial class SiteSidebarSecondary
{
    [Parameter]
    public PublicSiteSnapshot? Snapshot { get; set; }

    [Parameter]
    public string IdPrefix { get; set; } = "right-sidebar";

    private string HeadingId(string section) => $"{IdPrefix}-{section}-heading";

    private string ConnectLabel => L["connect"];
    private string UpdatesLabel => L["updates"];
    private bool ShowConnect => Snapshot?.Chrome.Visibility.Contact == true;
    private bool ShowFollowLink => Snapshot?.Chrome.Visibility.Follow == true;
    private bool ShowFeeds => ShowFollowLink;
    private bool ShowUpdates => ShowFollowLink;

    private string FollowLabel
    {
        get
        {
            var footerLabel = Snapshot
                ?.Chrome.Navigation.FooterLinks.FirstOrDefault(item =>
                    LastSegment(item.Route) == "follow"
                )
                ?.Label;
            if (!string.IsNullOrWhiteSpace(footerLabel))
                return footerLabel.ToLowerInvariant();

            return Snapshot is null
                ? string.Empty
                : PublicContentFields.PageField(Snapshot, "follow", "title").ToLowerInvariant();
        }
    }

    private IReadOnlyList<(string Href, string Icon, string Label)> Feeds =>
        [(L["feed_xml"], "rss", "RSS"), (L["atom_xml"], "rss", "Atom")];
    private string ContactPageLabel => L["contact_page"];
    private string LegalLabel => L["legal"];
    private string SourceLabel => L["source"];

    private IReadOnlyList<(string Route, string Icon, string Label)> LegalLinks =>
        new (string Route, string Icon, string Label, bool Visible)[]
        {
            ("license", "file-text", L["license"], Snapshot?.Chrome.Visibility.License == true),
            ("credits", "award", L["credits"], Snapshot?.Chrome.Visibility.Credits == true),
            (
                "contact",
                "message-circle",
                L["report_issue"],
                Snapshot?.Chrome.Visibility.Contact == true
            ),
        }
            .Where(link => link.Visible)
            .Select(link => (link.Route, link.Icon, link.Label))
            .ToArray();

    private bool ShowLegal => LegalLinks.Count > 0;

    private string? BuildSha =>
        string.IsNullOrWhiteSpace(Snapshot?.Chrome.Build.CommitSha)
            ? null
            : Snapshot!.Chrome.Build.CommitSha[
                ..Math.Min(7, Snapshot.Chrome.Build.CommitSha.Length)
            ];

    private string? BuildUrl =>
        SafeExternalUrl(Snapshot?.Chrome.Site.SourceRepositoryUrl) is string source
        && BuildSha is not null
            ? $"{source.TrimEnd('/')}/commit/{Snapshot!.Chrome.Build.CommitSha}"
            : null;

    private string LocalizedPath(string path) =>
        Urls.ForCulture(
            path.Equals("home", StringComparison.OrdinalIgnoreCase) ? "/" : path,
            Cultures.FromPath(RequestPath).Name
        );

    private static string LastSegment(string route) =>
        route.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries).LastOrDefault()
        ?? string.Empty;

    private static string? SafeExternalUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https"
            ? uri.AbsoluteUri
            : null;
}
