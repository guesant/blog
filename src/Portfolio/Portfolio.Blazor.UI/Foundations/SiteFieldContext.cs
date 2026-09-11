namespace Portfolio.Blazor.UI.Foundations;

/// <summary>Cascaded by SiteField so its descendants can wire id, aria-describedby, aria-required and aria-invalid consistently.</summary>
public sealed class SiteFieldContext
{
    /// <summary>id of the field's control, used by its label and description.</summary>
    public required string Id { get; init; }

    /// <summary>Space-separated ids the control should point aria-describedby at.</summary>
    public required string DescribedBy { get; init; }

    /// <summary>Whether the field must be filled in.</summary>
    public bool Required { get; init; }

    /// <summary>Whether the field currently fails validation.</summary>
    public bool Invalid { get; init; }
}
