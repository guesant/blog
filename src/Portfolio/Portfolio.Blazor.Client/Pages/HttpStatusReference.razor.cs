using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class HttpStatusReference
{
    private string CanonicalPath => RequestPath;

    [SupplyParameterFromQuery(Name = "filter")]
    private string? QueryFilter { get; set; }
    private bool _queryInitialized;
    private string _filter = string.Empty;
    private string Action => L["legacy_a17cbc671253"];
    private string Title => ToolsL["http_status_reference_title"];
    private string Description => ToolsL["http_status_reference_lead"];
    private string FilterLabel => L["legacy_253db84328b6"];
    private string SearchLabel => L["legacy_cc63bf81c53c"];
    private string EmptyLabel => L["legacy_3b7293427126"];
    private string Filter
    {
        get => _filter;
        set => _filter = value;
    }
    private IReadOnlyList<HttpStatusEntry> Results =>
        Portfolio.Blazor.Core.HttpStatusReference.Filter(Filter);

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _filter = QueryFilter ?? string.Empty;
        _queryInitialized = true;
    }
}
