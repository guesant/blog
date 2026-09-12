namespace Blog.Blazor.UI.Primitives;

public partial class SiteIcon
{
    /// <summary>Icon identifier resolved to a glyph and icon family.</summary>
    [Parameter, EditorRequired]
    public string Name { get; set; } = string.Empty;

    /// <summary>Target glyph size in pixels, mapped to the nearest icon-size token.</summary>
    [Parameter]
    public int Size { get; set; } = 14;

    /// <summary>Extra class applied to the root element.</summary>
    [Parameter]
    public string Class { get; set; } = "icon";

    /// <summary>When set, the icon carries this accessible name (role="img") instead of being
    /// hidden from assistive tech. Only needed when the icon is the sole content of a control -
    /// most call sites sit beside visible text and should leave this unset.</summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    private string IconClasses =>
        IconDefinition(Name) switch
        {
            ("phosphor", var name) => $"ph-fill ph-{name}",
            ("fontawesome", var name) => $"fa-solid fa-{name}",
            (_, var name) => $"icon-{name}",
        };

    private static (string Family, string Name) IconDefinition(string name) =>
        name.ToLowerInvariant() switch
        {
            "wrench" => ("phosphor", "wrench"),
            "external-link" => ("fontawesome", "arrow-up-right-from-square"),
            "arrow-right" => ("lucide", "arrow-right"),
            "arrow-up-right" => ("fontawesome", "arrow-up-right-from-square"),
            "mail" => ("fontawesome", "envelope"),
            "linkedin" => ("fontawesome", "briefcase"),
            "github" or "gitlab" or "code-branch" => ("fontawesome", "code-branch"),
            "lattes" => ("fontawesome", "graduation-cap"),
            "orcid" => ("fontawesome", "globe"),
            "menu" => ("fontawesome", "bars"),
            _ => ("lucide", name.ToLowerInvariant()),
        };

    private string IconSizeClass =>
        Size switch
        {
            <= 12 => "icon-size-xs",
            <= 14 => "icon-size-sm",
            <= 15 => "icon-size-md",
            <= 16 => "icon-size-lg",
            _ => "icon-size-xl",
        };
}
