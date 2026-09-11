using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class SiteFooter
{
    [Parameter]
    public PublicSiteSnapshot? Snapshot { get; set; }
    private string Copyright => Snapshot?.Chrome.Copyright ?? string.Empty;
}
