namespace Portfolio.Blazor.UI.Foundations;

/// <summary>When a tool form shows an explicit submit button.</summary>
public enum SiteToolFormSubmit
{
    /// <summary>In both the static and the hydrated branch.</summary>
    Always,

    /// <summary>Only without JavaScript, since the hydrated form recomputes live.</summary>
    StaticOnly,

    /// <summary>Never; the form has no submit action.</summary>
    Never,
}
