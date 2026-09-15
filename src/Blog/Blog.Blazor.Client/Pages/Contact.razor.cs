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
    private bool HasContact => Snapshot is not null && PublicVisibilityRules.HasContact(Snapshot);

    private string PageField(string name, string fallback) =>
        Snapshot is null
            ? fallback
            : PublicContentFields.PageField(Snapshot, "contact", name, fallback);
}
