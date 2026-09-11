namespace Portfolio.Blazor.UI.Composition;

/// <summary>One locale offered by SiteTranslationTabs.</summary>
/// <param name="Code">Culture code, such as "pt-BR".</param>
/// <param name="Label">Text shown on the tab.</param>
public sealed record SiteLocaleTab(string Code, string Label);
