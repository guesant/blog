namespace Blog.Blazor.Client.Pages;

public partial class FlowchartBuilder
{
    private string CanonicalPath => RequestPath;
    private string _source =
        "Início -> Entrada\nEntrada -> Processamento\nProcessamento -> Resultado";
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "source")]
    private string? QuerySource { get; set; }
    private string Action => L["tools_flowchart_builder"];
    private string Title => ToolsL["flowchart_builder_title"];
    private string Description => ToolsL["flowchart_builder_lead"];
    private string Note => L["use_one_connection_per_line_in_the_format"];
    private string InputLabel => L["connections"];
    private string DownloadLabel => L["download_svg"];
    private string GenerateLabel => L["generate"];
    private string ChartLabel => L["flowchart"];
    private string Source
    {
        get => _source;
        set => _source = value;
    }

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _source = QuerySource ?? _source;
        _queryInitialized = true;
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
            await JS.InvokeVoidAsync("import", "/flowchart-builder.js");
    }
}
