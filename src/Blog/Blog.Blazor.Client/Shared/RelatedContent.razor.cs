using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public partial class RelatedContent
{
    [Parameter]
    public IReadOnlyList<PublicRelatedContent>? Items { get; set; }
}
