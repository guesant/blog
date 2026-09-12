namespace Blog.Blazor.UI.Forms;

public partial class SiteField
{
    /// <summary>Id shared by the field's label, description and error, and by the control itself when it doesn't set its own.</summary>
    [Parameter, EditorRequired]
    public string Id { get; set; } = string.Empty;

    /// <summary>Marks the field as required for aria-required on the control.</summary>
    [Parameter]
    public bool Required { get; set; }

    /// <summary>Marks the field as invalid for aria-invalid on the control.</summary>
    [Parameter]
    public bool Invalid { get; set; }

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string? Class { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    private string RootClass => SiteCss.Join("site-form-field", Class);
    private SiteFieldContext Context =>
        new()
        {
            Id = Id,
            DescribedBy = $"{Id}-help {Id}-error",
            Required = Required,
            Invalid = Invalid,
        };
}
