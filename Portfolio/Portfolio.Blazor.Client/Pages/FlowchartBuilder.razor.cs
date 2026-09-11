namespace Portfolio.Blazor.Client.Pages;

public partial class FlowchartBuilder
{
    private string CanonicalPath => RequestPath;
    private string _source =
        "Início -> Entrada\nEntrada -> Processamento\nProcessamento -> Resultado";
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "source")]
    private string? QuerySource { get; set; }
    private string Action => L["legacy_7a914dbc994b"];
    private string Title => ToolsL["flowchart_builder_title"];
    private string Description => ToolsL["flowchart_builder_lead"];
    private string Note => L["legacy_205995c9d061"];
    private string InputLabel => L["legacy_5ee7cbfbc09d"];
    private string DownloadLabel => L["legacy_faf8444b785a"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string ChartLabel => L["legacy_8e3a96533673"];
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
