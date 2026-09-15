using System.Text.Json;

namespace Blog.Blazor.Core;

public static class PublicVisibilityRules
{
    private static readonly string[] NowFieldKeys =
    [
        "trabalhando",
        "construindo",
        "estudando",
        "lendo",
        "ouvindo",
        "assistindo",
    ];

    private static readonly string[] LicenseFieldKeys = ["code_body", "content_body", "ai_body"];

    private static readonly string[] FollowFieldKeys =
    [
        "rss_title",
        "atom_title",
        "jsonfeed_title",
        "api_title",
        "sitemap_title",
        "robots_title",
        "webfinger_title",
        "activitypub_title",
        "websub_title",
        "webmention_title",
    ];

    public static PublicVisibility Compute(PublicSiteSnapshot snapshot) =>
        new(
            About: HasAbout(snapshot),
            Resume: HasResume(snapshot),
            Portfolio: HasPortfolio(snapshot),
            Cases: HasCases(snapshot),
            Contact: HasContact(snapshot),
            License: HasLicense(snapshot),
            Credits: HasCredits(snapshot),
            Follow: HasFollow(snapshot),
            Feed: PublicFeedContent.HasItems(snapshot),
            Writing: snapshot.Writings.Count > 0,
            Findings: snapshot.Findings.Count > 0,
            Topics: snapshot.Topics.Count > 0,
            Collections: snapshot.Collections.Count > 0,
            Snippets: snapshot.Snippets.Count > 0
        );

    public static bool HasCases(PublicSiteSnapshot snapshot) => snapshot.Cases.Count > 0;

    public static bool HasCredits(PublicSiteSnapshot snapshot) => snapshot.Credits.Count > 0;

    public static bool HasPortfolio(PublicSiteSnapshot snapshot) =>
        snapshot.FeaturedCases is { Count: > 0 }
        || snapshot.FeaturedProjects is { Count: > 0 }
        || snapshot.Experiments is { Count: > 0 };

    public static bool HasContact(PublicSiteSnapshot snapshot) =>
        snapshot.Chrome.Site.ContactAvailable
        && (
            snapshot.Chrome.Site.ProtectedEmail is not null
            || (snapshot.Chrome.Site.ContactProfiles ?? []).Any(profile =>
                SafeContactUrl(profile.Url) is not null
            )
        );

    public static bool HasResume(PublicSiteSnapshot snapshot) =>
        ResumeContent.HasContent(snapshot.Resume);

    public static bool HasAbout(PublicSiteSnapshot snapshot) =>
        snapshot.Chrome.Profile is not null
        || !string.IsNullOrWhiteSpace(PublicContentFields.PageField(snapshot, "about", "story"))
        || HasNowEntries(snapshot)
        || HasMilestones(snapshot.Chrome.Profile);

    public static bool HasLicense(PublicSiteSnapshot snapshot) =>
        LicenseFieldKeys.Any(key =>
            !string.IsNullOrWhiteSpace(PublicContentFields.PageField(snapshot, "license", key))
        );

    public static bool HasFollow(PublicSiteSnapshot snapshot) =>
        FollowFieldKeys.Any(key =>
            !string.IsNullOrWhiteSpace(PublicContentFields.PageField(snapshot, "follow", key))
        );

    private static bool HasNowEntries(PublicSiteSnapshot snapshot) =>
        NowFieldKeys.Any(key =>
            !string.IsNullOrWhiteSpace(PublicContentFields.PageField(snapshot, "now", key))
        );

    private static bool HasMilestones(PublicProfile? profile)
    {
        if (profile?.Milestones is not { ValueKind: JsonValueKind.Array } values)
            return false;

        foreach (var value in values.EnumerateArray())
        {
            if (
                value.TryGetProperty("hidden", out var hidden)
                && hidden.ValueKind == JsonValueKind.True
            )
                continue;

            var title = PublicContentFields.String(
                value,
                "title",
                PublicContentFields.String(value, "name")
            );
            var description = PublicContentFields.String(
                value,
                "description",
                PublicContentFields.String(value, "body")
            );
            if (!string.IsNullOrWhiteSpace(title) || !string.IsNullOrWhiteSpace(description))
                return true;
        }

        return false;
    }

    private static string? SafeContactUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri)
        && uri.Scheme is "http" or "https" or "mailto"
            ? uri.AbsoluteUri
            : null;
}
