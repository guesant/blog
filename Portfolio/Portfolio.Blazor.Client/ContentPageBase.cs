using Microsoft.AspNetCore.Components;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client;

public abstract class ContentPageBase : LocalizedComponentBase
{
    [Inject]
    protected IPublicSiteContentProvider ContentProvider { get; set; } = default!;

    protected PublicSiteSnapshot? Snapshot { get; private set; }

    protected override async Task OnInitializedAsync() =>
        Snapshot = await ContentProvider.GetAsync(CurrentLocale);
}
