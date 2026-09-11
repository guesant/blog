using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class Contact
{
    private string Title => PageField("title", L["legacy_68be6eee1eb9"]);
    private string Description =>
        HasContact ? PageField("description", FallbackDescription) : (L["legacy_5fe6d16f2789"]);
    private string FallbackDescription => L["legacy_5449bb2d7a16"];
    private string CanonicalPath => L["legacy_81c69aa356b9"];
    private IReadOnlyList<PublicContactProfile> Profiles =>
        Snapshot?.Chrome.Site.ContactProfiles ?? [];
    private bool HasContact =>
        Snapshot?.Chrome.Site.ContactAvailable == true
        && (
            Snapshot.Chrome.Site.ProtectedEmail is not null
            || Profiles.Any(profile => SafeUrl(profile.Url) is not null)
        );

    private string PageField(string name, string fallback)
    {
        if (
            Snapshot?.Pages.TryGetValue("contact", out var page) != true
            || page.ValueKind != System.Text.Json.JsonValueKind.Object
            || !page.TryGetProperty(name, out var value)
            || value.ValueKind != System.Text.Json.JsonValueKind.String
        )
            return fallback;
        return value.GetString() ?? fallback;
    }

    private static string? SafeUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri)
        && uri.Scheme is "http" or "https" or "mailto"
            ? uri.AbsoluteUri
            : null;
}
