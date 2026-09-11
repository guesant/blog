namespace Portfolio.Blazor.UI.Foundations;

/// <summary>Visual style of a button or button-like link.</summary>
public enum SiteButtonVariant
{
    /// <summary>Filled with the primary colour.</summary>
    Default,

    /// <summary>Filled with the danger colour.</summary>
    Destructive,

    /// <summary>Bordered on the page surface.</summary>
    Outline,

    /// <summary>Bordered on the muted surface.</summary>
    Secondary,

    /// <summary>No border or background until hovered.</summary>
    Ghost,

    /// <summary>Plain inline link, no button chrome.</summary>
    Link,
}
