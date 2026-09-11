using System.Linq.Expressions;

namespace Portfolio.Blazor.UI.Forms;

public partial class SiteValidationMessage
{
    /// <summary>Explicit id; when omitted, derived from the cascaded SiteFieldContext as "{Id}-error" so it
    /// matches the describedby the field's own control already expects - no real call site sets this
    /// explicitly today, so without this fallback the rendered id never matched and the error text was
    /// never associated to its input for assistive tech.</summary>
    [Parameter]
    public string? Id { get; set; }

    [Parameter]
    public Expression<Func<string>>? For { get; set; }

    [CascadingParameter]
    private SiteFieldContext? FieldContext { get; set; }

    private string ResolvedId =>
        !string.IsNullOrWhiteSpace(Id) ? Id
        : FieldContext is not null ? $"{FieldContext.Id}-error"
        : string.Empty;
}
