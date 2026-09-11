namespace Portfolio.Blazor.UI.Forms;

public partial class SiteNativeSelect
{
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    protected override string BaseInputClass => "form-select";
}
