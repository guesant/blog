using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public partial class SiteFooter
{
    [Parameter]
    public PublicSiteSnapshot? Snapshot { get; set; }
    private string Copyright => Snapshot?.Chrome.Copyright ?? string.Empty;
}
