using Portfolio.Blazor.Core;

namespace Portfolio.Blazor.Client.Pages;

public partial class GitignoreGenerator
{
    private string CanonicalPath => RequestPath;

    private sealed class TemplateOption(string name, bool selected)
    {
        public string Name { get; } = name;
        public bool Selected { get; set; } = selected;
    }

    private List<TemplateOption> Options { get; } =
        GitignoreTemplates.All.Keys.Select(name => new TemplateOption(name, false)).ToList();
    private string _filter = string.Empty;
    private bool _queryInitialized;

    [SupplyParameterFromQuery(Name = "templates")]
    private string[]? QueryTemplates { get; set; }

    [SupplyParameterFromQuery(Name = "filter")]
    private string? QueryFilter { get; set; }
    private string Action => L["legacy_f1e81c4c631e"];
    private string Title => ToolsL["gitignore_generator_title"];
    private string Description => ToolsL["gitignore_generator_lead"];
    private string FilterLabel => L["legacy_717aaf07d311"];
    private string OutputLabel => L["legacy_1d1c0e33dc3c"];
    private string GenerateLabel => L["legacy_cc7df97fb1b2"];
    private string CopyLabel => L["legacy_a3b71416a5f3"];
    private string DownloadLabel => L["legacy_c36a12636bbd"];
    private string Filter
    {
        get => _filter;
        set => _filter = value;
    }
    private IEnumerable<string> Selected =>
        Options.Where(option => option.Selected).Select(option => option.Name);
    private string Output => GitignoreTemplates.Build(Selected);
    private string DownloadHref => $"data:text/plain;charset=utf-8,{Uri.EscapeDataString(Output)}";

    protected override void OnParametersSet()
    {
        if (_queryInitialized)
            return;
        _filter = QueryFilter ?? string.Empty;
        if (QueryTemplates is { Length: > 0 })
            foreach (var option in Options)
                option.Selected = QueryTemplates.Contains(option.Name, StringComparer.Ordinal);
        _queryInitialized = true;
    }
}
