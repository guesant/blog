namespace Blog.Blazor.UI.Foundations;

/// <summary>One option offered by a select.</summary>
/// <param name="Value">Value submitted when the option is chosen.</param>
/// <param name="Label">Text shown for the option.</param>
/// <param name="Icon">Optional icon shown before the label, in the popup and in the closed trigger.</param>
public sealed record SiteSelectOption(string Value, string Label, string? Icon = null);
