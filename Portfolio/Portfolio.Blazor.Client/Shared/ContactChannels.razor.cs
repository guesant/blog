using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class ContactChannels
{
    [Parameter]
    public IReadOnlyList<PublicContactProfile> Profiles { get; set; } = [];

    [Parameter]
    public PublicProtectedEmailChallenge? EmailChallenge { get; set; }

    [Parameter]
    public bool EmailAvailable { get; set; }

    [Parameter]
    public string? Variant { get; set; }

    [Parameter]
    public bool UseSidebarStyle { get; set; }

    [Parameter]
    public SiteJustify Justify { get; set; } = SiteJustify.Start;

    [Parameter]
    public RenderFragment? LeadingContent { get; set; }
    private string RootClass =>
        UseSidebarStyle ? "site-contact-channels is-sidebar" : "site-contact-channels";
    private string EmailLabel => L["reveal_email"];
    private string WorkingLabel => L["preparing_email"];
    private string ErrorLabel => L["email_error"];
    private string RetryLabel => L["try_again"];

    private string FooterLinkClass(string? extra) =>
        UseSidebarStyle
            ? string.Join(
                ' ',
                new[] { "nav-link", "sidebar-action", extra }.Where(value =>
                    !string.IsNullOrWhiteSpace(value)
                )
            )
        : string.IsNullOrWhiteSpace(extra) ? "footer-action"
        : $"footer-action {extra}";

    private string ActionClass(string action) =>
        UseSidebarStyle ? $"sidebar-action {action}" : $"footer-action {action}";

    private static string ContactIcon(string platform) =>
        platform.ToLowerInvariant() switch
        {
            "linkedin" => "linkedin",
            "github" => "github",
            "gitlab" => "gitlab",
            "lattes" => "lattes",
            "orcid" => "orcid",
            _ => "external-link",
        };

    private static Uri? TryGetUri(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri)
        && uri.Scheme is "http" or "https" or "mailto"
            ? uri
            : null;
}
