using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class MarkdownToHtml
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["tools_markdown_to_html"];
    private string Title => ToolsL["markdown_to_html_title"];
    private string Description => ToolsL["markdown_to_html_lead"];
    private string MarkdownInputLabel => L["markdown_input"];
    private string PreviewLabel => L["preview"];
    private string HtmlOutputLabel => L["html_output"];
    private string ConvertLabel => L["converter"];
    private string CopyLabel => L["copy"];
    private string Input
    {
        get => _input;
        set => _input = value;
    }
    private string Html => Blog.Blazor.Core.MarkdownHtmlConverter.Convert(Input);

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? string.Empty;
        _queryInitialized = true;
    }
}
