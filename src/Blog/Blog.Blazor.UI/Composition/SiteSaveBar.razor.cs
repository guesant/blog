namespace Blog.Blazor.UI.Composition;

public partial class SiteSaveBar
{
    /// <summary>Label of the submit button.</summary>
    [Parameter]
    public string SubmitLabel { get; set; } = "Save";

    /// <summary>Label shown on the submit button while saving.</summary>
    [Parameter]
    public string SavingLabel { get; set; } = "Saving…";

    /// <summary>Whether a save is in flight.</summary>
    [Parameter]
    public bool Saving { get; set; }

    /// <summary>Destination of the cancel link.</summary>
    [Parameter, EditorRequired]
    public string CancelHref { get; set; } = string.Empty;

    /// <summary>Label of the cancel link.</summary>
    [Parameter]
    public string CancelLabel { get; set; } = "Cancel";

    /// <summary>Whether the bar sticks to the bottom of the scrolling region.</summary>
    [Parameter]
    public bool Sticky { get; set; } = true;

    private string RootClass =>
        SiteCss.Join("site-save-bar", Sticky ? "site-save-bar-sticky" : null);
}
