using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class SiteFooter
{
    [Parameter]
    public PublicSiteSnapshot? Snapshot { get; set; }
    private string DefaultCopyright =>
        $"© {DateTime.UtcNow.Year} Gabriel R. Antunes. {L["some_rights_reserved"]}";
}
