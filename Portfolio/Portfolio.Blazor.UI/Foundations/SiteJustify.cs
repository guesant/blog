namespace Portfolio.Blazor.UI.Foundations;

/// <summary>Main-axis distribution used by layout primitives.</summary>
public enum SiteJustify
{
    /// <summary>Pack children against the start of the main axis.</summary>
    Start,

    /// <summary>Centre children on the main axis.</summary>
    Center,

    /// <summary>Pack children against the end of the main axis.</summary>
    End,

    /// <summary>Spread children apart, first and last flush to the edges.</summary>
    Between,
}
