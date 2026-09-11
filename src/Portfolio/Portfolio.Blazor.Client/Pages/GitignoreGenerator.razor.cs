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
    private string Action => L["tools_gitignore_generator"];
    private string Title => ToolsL["gitignore_generator_title"];
    private string Description => ToolsL["gitignore_generator_lead"];
    private string FilterLabel => L["filter_templates"];
    private string OutputLabel => L["output"];
    private string GenerateLabel => L["generate"];
    private string CopyLabel => L["copy"];
    private string DownloadLabel => L["download"];
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
