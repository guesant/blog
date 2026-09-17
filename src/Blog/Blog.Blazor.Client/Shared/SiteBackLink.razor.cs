namespace Blog.Blazor.Client.Shared;

public partial class SiteBackLink
{
    [Parameter]
    public string? Href { get; set; }

    [Parameter]
    public string Label { get; set; } = string.Empty;

    private string AriaLabel => L["back_to", Label];
}
