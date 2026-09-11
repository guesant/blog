using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class MarkdownToHtml
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["legacy_78d25149bfa4"];
    private string Title => ToolsL["markdown_to_html_title"];
    private string Description => ToolsL["markdown_to_html_lead"];
    private string MarkdownInputLabel => L["legacy_192b01859ac0"];
    private string PreviewLabel => L["legacy_3822506f8f59"];
    private string HtmlOutputLabel => L["legacy_946c9059cd45"];
    private string ConvertLabel => L["legacy_ae125407093e"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string Input
    {
        get => _input;
        set => _input = value;
    }
    private string Html => Portfolio.Blazor.Core.MarkdownHtmlConverter.Convert(Input);

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? string.Empty;
        _queryInitialized = true;
    }
}
