using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class HttpStatusReference
{
    private string CanonicalPath => RequestPath;

    [SupplyParameterFromQuery(Name = "filter")]
    private string? QueryFilter { get; set; }
    private bool _queryInitialized;
    private string _filter = string.Empty;
    private string Action => L["tools_http_status_reference"];
    private string Title => ToolsL["http_status_reference_title"];
    private string Description => ToolsL["http_status_reference_lead"];
    private string FilterLabel => L["filter_by_code_or_name"];
    private string SearchLabel => L["filter"];
    private string EmptyLabel => L["no_status_codes_match_that_filter"];
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
