namespace Portfolio.Blazor.UI.Foundations;

/// <summary>Joins CSS class fragments, skipping null or blank ones.</summary>
public static class SiteCss
{
    /// <summary>Joins the given class fragments with spaces, skipping null or blank ones.</summary>
    /// <param name="parts">Class fragments to join.</param>
    /// <returns>The joined class attribute value.</returns>
    public static string Join(params string?[] parts) =>
        string.Join(' ', parts.Where(part => !string.IsNullOrWhiteSpace(part)));
}
