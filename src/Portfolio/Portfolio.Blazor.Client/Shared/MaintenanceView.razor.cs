using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class MaintenanceView
{
    [Parameter, EditorRequired]
    public PublicSiteSnapshot Snapshot { get; set; } = default!;
}
