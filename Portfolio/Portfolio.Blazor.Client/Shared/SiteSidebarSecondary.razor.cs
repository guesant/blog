using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class SiteSidebarSecondary
{
    [Parameter]
    public PublicSiteSnapshot? Snapshot { get; set; }
    private string ConnectLabel => L["connect"];
    private string UpdatesLabel => L["legacy_efc6c5d00b30"];

    private (string Route, string Label)? FollowLink =>
        Snapshot
            ?.Chrome.Navigation.FooterLinks.Where(item =>
                item.Route.Trim('/')
                    .Split('/', StringSplitOptions.RemoveEmptyEntries)
                    .LastOrDefault() == "follow"
            )
            .Select(item =>
                ((string Route, string Label)?)
                    ("follow", (item.Label ?? "follow").ToLowerInvariant())
            )
            .FirstOrDefault();

    private IReadOnlyList<(string Href, string Icon, string Label)> Feeds =>
        [(L["legacy_362d5aad99f1"], "rss", "RSS"), (L["legacy_eabac209b499"], "rss", "Atom")];
    private string ContactPageLabel => L["contact_page"];
    private string LegalLabel => L["legal"];
    private string SourceLabel => L["source"];

    private IReadOnlyList<(string Route, string Icon, string Label)> LegalLinks =>
        [
            ("license", "file-text", L["license"]),
            ("credits", "award", L["credits"]),
            ("contact", "message-circle", L["report_issue"]),
        ];

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

    private static string? SafeExternalUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https"
            ? uri.AbsoluteUri
            : null;
}
