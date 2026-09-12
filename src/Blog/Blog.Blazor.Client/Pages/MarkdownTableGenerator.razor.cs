using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Pages;

public partial class MarkdownTableGenerator
{
    private string CanonicalPath => RequestPath;
    private string _input = string.Empty;
    private string _output = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "input")]
    private string? QueryInput { get; set; }
    private string Action => L["tools_markdown_table_generator"];
    private string Title => ToolsL["markdown_table_generator_title"];
    private string Description => ToolsL["markdown_table_generator_lead"];
    private string InputLabel => L["rows_tab_or_comma_separated_one_per_line"];
    private string OutputLabel => L["output"];
    private string GenerateLabel => L["generate"];
    private string CopyLabel => L["copy"];
    private string Input
    {
        get => _input;
        set => _input = value;
    }
    private string Output => _output;

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _input = QueryInput ?? string.Empty;
        _output = Blog.Blazor.Core.MarkdownTableGenerator.Generate(_input);
        _queryInitialized = true;
    }

    private void Generate() => _output = Blog.Blazor.Core.MarkdownTableGenerator.Generate(_input);
}
