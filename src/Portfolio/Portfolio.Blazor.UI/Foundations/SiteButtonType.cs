namespace Portfolio.Blazor.UI.Foundations;

/// <summary>HTML type attribute of a rendered button.</summary>
public enum SiteButtonType
{
    /// <summary>A plain button that submits nothing.</summary>
    Button,

    /// <summary>Submits the surrounding form.</summary>
    Submit,

    /// <summary>Resets the surrounding form.</summary>
    Reset,
}
