namespace Portfolio.Blazor.UI.Foundations;

/// <summary>Cross-axis alignment used by layout primitives.</summary>
public enum SiteAlign
{
    /// <summary>Pack children against the start of the cross axis.</summary>
    Start,

    /// <summary>Centre children on the cross axis.</summary>
    Center,

    /// <summary>Pack children against the end of the cross axis.</summary>
    End,

    /// <summary>Align children on their text baseline.</summary>
    Baseline,

    /// <summary>Stretch children to fill the cross axis.</summary>
    Stretch,
}
