using System.Globalization;
using System.Resources;
using System.Text;
using Blog.Blazor.Core.Localization;

namespace Blog.Blazor.Core;

public readonly record struct ToolDefinition(string Slug, string Category, bool IsStub = false);

public static class ToolCatalog
{
    private static readonly ResourceManager Resources = new(
        typeof(ToolsResource).FullName!,
        typeof(ToolsResource).Assembly
    );

    private static readonly CultureInfo[] SearchCultures =
    [
        CultureInfo.InvariantCulture,
        CultureInfo.GetCultureInfo("pt-BR"),
    ];

    public static string LocalizedTitle(ToolDefinition tool, CultureInfo culture) =>
        Text(tool, "title", culture);

    public static string LocalizedDescription(ToolDefinition tool, CultureInfo culture) =>
        Text(tool, "summary", culture);

    public static string ResourceKey(string slug) => slug.Replace('-', '_');

    private static string Text(ToolDefinition tool, string suffix, CultureInfo culture) =>
        Resources.GetString($"{ResourceKey(tool.Slug)}_{suffix}", culture) ?? tool.Slug;

    private static readonly ToolDefinition[] Definitions =
    [
        new("text-counter", "text"),
        new("text-reverser", "text"),
        new("line-break-remover", "text"),
        new("whitespace-trimmer", "text"),
        new("duplicate-line-remover", "text"),
        new("accent-remover", "text"),
        new("slugify", "text"),
        new("text-repeater", "text"),
        new("text-case", "text"),
        new("case-style-converter", "code"),
        new("dot-case-converter", "code"),
        new("duplicate-word-finder", "text"),
        new("palindrome-checker", "text"),
        new("word-frequency-counter", "text"),
        new("line-sorter", "text"),
        new("reading-time-estimator", "text"),
        new("invisible-char-remover", "text"),
        new("lorem-ipsum-generator", "generators"),
        new("pig-latin", "text"),
        new("leetspeak", "text"),
        new("uwu-speak", "text"),
        new("quadratic-equation", "math"),
        new("statistics-analyzer", "statistics"),
        new("number-theory", "math"),
        new("percentage-calculator", "math"),
        new("gcd-lcm-calculator", "math"),
        new("prime-factorization", "math"),
        new("combinatorics", "math"),
        new("sequences", "math"),
        new("base-converter", "math"),
        new("fractions", "math"),
        new("linear-systems", "math"),
        new("matrix-calculator", "math"),
        new("vector-calculator", "math"),
        new("function-plotter", "math"),
        new("correlation-calculator", "statistics"),
        new("normal-distribution", "statistics"),
        new("linear-regression", "statistics"),
        new("kinematics", "physics"),
        new("newtons-second-law", "physics"),
        new("ideal-gas", "physics"),
        new("wave-calculator", "physics"),
        new("projectile-motion", "physics"),
        new("circular-motion", "physics"),
        new("dilution-calculator", "chemistry"),
        new("ph-calculator", "chemistry"),
        new("amortization-calculator", "finance"),
        new("table-editor", "statistics"),
        new("json-formatter", "code"),
        new("json-to-csv", "code"),
        new("csv-chart", "data"),
        new("data-cleaner", "data"),
        new("roi-calculator", "finance"),
        new("inflation-calculator", "finance"),
        new("break-even-calculator", "finance"),
        new("moles-calculator", "chemistry"),
        new("chemical-equation-balancer", "chemistry"),
        new("compound-interest-calculator", "finance"),
        new("ohms-law", "engineering"),
        new("molar-mass", "chemistry"),
        new("age-calculator", "math"),
        new("arithmetic-progression", "math"),
        new("base64-encoder", "code"),
        new("binary-text-codec", "code"),
        new("bmi-calculator", "math"),
        new("cipher-tool", "code"),
        new("color-converter", "design"),
        new("color-wheel", "design"),
        new("colorblindness-simulator", "design"),
        new("complex-number-calculator", "math"),
        new("composition-calculator", "chemistry"),
        new("contrast-checker", "design"),
        new("css-border-radius-generator", "generators"),
        new("css-box-shadow-generator", "generators"),
        new("css-clamp-calculator", "generators"),
        new("css-gradient-generator", "generators"),
        new("date-difference-calculator", "math"),
        new("env-file-validator", "code"),
        new("fake-name-generator", "generators"),
        new("find-and-replace", "text"),
        new("flowchart-builder", "engineering"),
        new("fraction-calculator", "math"),
        new("geometric-progression", "math"),
        new("gitignore-generator", "dev"),
        new("hash-generator", "code"),
        new("hex-text-codec", "code"),
        new("html-entity-codec", "code"),
        new("http-status-reference", "dev"),
        new("image-color-picker", "image"),
        new("image-compressor", "image"),
        new("image-dimension-calculator", "image"),
        new("image-format-converter", "image"),
        new("image-resizer", "image"),
        new("image-to-base64", "image"),
        new("jwt-decoder", "code"),
        new("linear-system-2x2", "math"),
        new("linear-system-3x3", "math"),
        new("loan-interest-calculator", "finance"),
        new("markdown-table-generator", "code"),
        new("markdown-to-html", "dev"),
        new("mechanical-energy", "physics"),
        new("morse-code-translator", "code"),
        new("nato-phonetic-alphabet", "text"),
        new("number-base-converter", "code"),
        new("password-generator", "generators"),
        new("periodic-table", "chemistry"),
        new("qr-code-generator", "generators"),
        new("query-string-parser", "code"),
        new("random-color-palette", "generators"),
        new("random-date-generator", "generators"),
        new("random-number-generator", "generators"),
        new("random-string-generator", "generators"),
        new("regex-tester", "dev"),
        new("resistor-network", "engineering"),
        new("robots-txt-generator", "dev"),
        new("roman-numeral-converter", "text"),
        new("sensible-heat", "physics"),
        new("svg-to-png", "image"),
        new("timestamp-converter", "dev"),
        new("triangle-calculator", "math"),
        new("unit-converter", "math"),
        new("url-encoder", "code"),
        new("user-agent-parser", "dev"),
        new("utf8-inspector", "code"),
        new("uuid-generator", "generators"),
        new("viewport-info", "dev"),
        new("vigenere-cipher", "text"),
    ];

    private static readonly ToolDefinition[] PlannedDefinitions = [];

    public static IReadOnlyList<ToolDefinition> All =>
        Definitions.Concat(PlannedDefinitions).ToArray();

    public static IReadOnlyList<string> Categories =>
        All.Select(tool => tool.Category)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Order(StringComparer.OrdinalIgnoreCase)
            .ToArray();

    public static IReadOnlyList<ToolDefinition> Filter(string? query, string? category)
    {
        var normalizedQuery = SearchKey(query?.Trim() ?? string.Empty);
        var normalizedCategory = category?.Trim() ?? string.Empty;

        return All.Where(tool =>
                normalizedCategory.Length == 0
                || tool.Category.Equals(normalizedCategory, StringComparison.OrdinalIgnoreCase)
            )
            .Where(tool =>
                normalizedQuery.Length == 0
                || SearchKey(tool.Slug).Contains(normalizedQuery, StringComparison.Ordinal)
                || SearchKey(tool.Category).Contains(normalizedQuery, StringComparison.Ordinal)
                || SearchCultures.Any(culture =>
                    SearchKey(LocalizedTitle(tool, culture))
                        .Contains(normalizedQuery, StringComparison.Ordinal)
                    || SearchKey(LocalizedDescription(tool, culture))
                        .Contains(normalizedQuery, StringComparison.Ordinal)
                )
            )
            .ToArray();
    }

    private static string SearchKey(string value)
    {
        var normalized = value.Normalize(NormalizationForm.FormD);
        var withoutDiacritics = normalized.Where(character =>
            CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark
        );

        return string.Concat(withoutDiacritics)
            .Normalize(NormalizationForm.FormC)
            .ToLowerInvariant();
    }
}
