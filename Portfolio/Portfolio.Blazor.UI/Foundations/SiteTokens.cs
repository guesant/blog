namespace Portfolio.Blazor.UI.Foundations;

/// <summary>Maps layout-primitive enums to the data-* token strings shared by SiteStack, SiteInline, and SiteSplit.</summary>
public static class SiteTokens
{
    /// <summary>Lowercased data-gap token for a spacing value.</summary>
    public static string Gap(SiteSpace value) => value.ToString().ToLowerInvariant();

    /// <summary>Lowercased data-align token for an alignment value.</summary>
    public static string Align(SiteAlign value) => value.ToString().ToLowerInvariant();
}
