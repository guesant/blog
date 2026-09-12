namespace Blog.Blazor.UI.Templates;

public partial class SiteAdminShell
{
    /// <summary>Brand/logo rendered at the top of the sidebar.</summary>
    [Parameter]
    public RenderFragment? Brand { get; set; }

    /// <summary>Accessible name for the primary nav landmark.</summary>
    [Parameter]
    public string NavAriaLabel { get; set; } = "admin";

    /// <summary>Primary nav links.</summary>
    [Parameter]
    public RenderFragment? Nav { get; set; }

    /// <summary>Content rendered after the nav, e.g. a sign-out form.</summary>
    [Parameter]
    public RenderFragment? NavFooter { get; set; }

    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;
}
