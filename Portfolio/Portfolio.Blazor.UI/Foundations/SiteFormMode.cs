namespace Portfolio.Blazor.UI.Foundations;

/// <summary>Whether a form renders its static or interactive branch.</summary>
public enum SiteFormMode
{
    /// <summary>Follow the renderer: static markup before hydration, interactive after.</summary>
    Auto,

    /// <summary>Always render the no-JavaScript branch.</summary>
    Static,

    /// <summary>Always render the hydrated branch.</summary>
    Interactive,
}
