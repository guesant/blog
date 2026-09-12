using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public partial class MaintenanceView
{
    [Parameter, EditorRequired]
    public PublicSiteSnapshot Snapshot { get; set; } = default!;
}
