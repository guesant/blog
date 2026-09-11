using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Shared;

public partial class RelatedContent
{
    [Parameter]
    public IReadOnlyList<PublicRelatedContent>? Items { get; set; }
}
