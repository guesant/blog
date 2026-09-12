using System.Linq.Expressions;
using Blog.Blazor.Core.Localization;
using Microsoft.Extensions.Localization;

namespace Blog.Blazor.UI.Forms;

public partial class SiteFilterSelect
{
    [Parameter, EditorRequired]
    public string Icon { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string Id { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string Name { get; set; } = string.Empty;

    [Parameter]
    public string Value { get; set; } = string.Empty;

    [Parameter]
    public EventCallback<string> ValueChanged { get; set; }

    [Parameter]
    public Expression<Func<string>>? ValueExpression { get; set; }

    [Parameter, EditorRequired]
    public IReadOnlyList<SiteSelectOption> Options { get; set; } = [];

    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    [Parameter]
    public string EmptyText { get; set; } = string.Empty;

    [Parameter]
    public bool Clearable { get; set; } = true;

    [Parameter]
    public string? ClearAriaLabel { get; set; }

    private Task HandleValueChanged(string value) => ValueChanged.InvokeAsync(value);

    private Expression<Func<string>> ResolvedValueExpression => ValueExpression ?? (() => Value);

    private string ResolvedClearAriaLabel => ClearAriaLabel ?? L["clear_field", Label];
}
