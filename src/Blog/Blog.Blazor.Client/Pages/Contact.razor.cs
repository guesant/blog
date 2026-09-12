using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class Contact
{
    private string Title => PageField("title", L["contact"]);
    private string Description =>
        HasContact
            ? PageField("description", FallbackDescription)
            : (L["contact_is_currently_unavailable"]);
    private string FallbackDescription => L["talk_about_software_development_technical"];
    private string CanonicalPath => L["contact_path"];
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
