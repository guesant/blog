using System.Globalization;

namespace Blog.Blazor.Core.Localization;

public interface ICultureCatalog
{
    CultureInfo DefaultCulture { get; }

    IReadOnlyList<CultureInfo> SupportedCultures { get; }

    bool IsSupported(string? name);

    CultureInfo Normalize(string? name);

    CultureInfo FromPath(string? path);
}

public sealed class CultureCatalog : ICultureCatalog
{
    public const string DefaultCultureName = "en";

    private static readonly IReadOnlyList<CultureInfo> Cultures =
    [
        CultureInfo.GetCultureInfo("en"),
        CultureInfo.GetCultureInfo("pt-BR"),
    ];

    public CultureInfo DefaultCulture => Cultures[0];

    public IReadOnlyList<CultureInfo> SupportedCultures => Cultures;

    public bool IsSupported(string? name) => TryGet(name, out _);

    public CultureInfo Normalize(string? name) =>
        TryGet(name, out var culture) ? culture : DefaultCulture;

    public static string NormalizeName(string? name) =>
        name?.Equals("pt-BR", StringComparison.OrdinalIgnoreCase) == true
            ? "pt-BR"
            : DefaultCultureName;

    public static string LanguageCode(string? name) =>
        CultureInfo.GetCultureInfo(NormalizeName(name)).TwoLetterISOLanguageName.ToUpperInvariant();

    public static bool HasPortuguesePrefix(string? path) =>
        path?.Equals("/pt-BR", StringComparison.OrdinalIgnoreCase) == true
        || path?.StartsWith("/pt-BR/", StringComparison.OrdinalIgnoreCase) == true;

    public static string RemoveCulturePrefix(string? path)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            return "/";
        }

        var value = path.StartsWith('/') ? path : $"/{path}";
        if (
            value.Equals("/home", StringComparison.OrdinalIgnoreCase)
            || value.Equals("/pt-BR", StringComparison.OrdinalIgnoreCase)
        )
        {
            return "/";
        }

        return value.StartsWith("/pt-BR/", StringComparison.OrdinalIgnoreCase) ? value[6..] : value;
    }

    public static string UrlPrefix(string? name) =>
        NormalizeName(name).Equals("pt-BR", StringComparison.OrdinalIgnoreCase)
            ? "/pt-BR"
            : string.Empty;

    public CultureInfo FromPath(string? path)
    {
        var segment = path
            ?.Trim('/')
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .FirstOrDefault();
        return IsSupported(segment) ? Normalize(segment) : DefaultCulture;
    }

    private static bool TryGet(string? name, out CultureInfo culture)
    {
        culture =
            Cultures.FirstOrDefault(item =>
                item.Name.Equals(name, StringComparison.OrdinalIgnoreCase)
            ) ?? Cultures[0];
        return culture.Name.Equals(name, StringComparison.OrdinalIgnoreCase);
    }
}

public interface ILocalizedUrlBuilder
{
    string ForCulture(string path, string culture);

    string SwitchCulture(string currentUrl, string culture);
}

public sealed class LocalizedUrlBuilder(ICultureCatalog cultures) : ILocalizedUrlBuilder
{
    public string ForCulture(string path, string culture)
    {
        var normalized = cultures.Normalize(culture).Name;
        var unlocalized = CultureCatalog.RemoveCulturePrefix(path);
        return normalized.Equals(
            CultureCatalog.DefaultCultureName,
            StringComparison.OrdinalIgnoreCase
        )
            ? unlocalized
            : $"/{normalized}{(unlocalized == "/" ? string.Empty : unlocalized)}";
    }

    public string SwitchCulture(string currentUrl, string culture)
    {
        if (!Uri.TryCreate(currentUrl, UriKind.Absolute, out var uri))
        {
            return ForCulture("/", culture);
        }

        var path = ForCulture(uri.AbsolutePath, culture);
        return path + uri.Query + uri.Fragment;
    }
}

public static class LocalizedUrls
{
    public static string Current(string path)
    {
        var value =
            string.IsNullOrWhiteSpace(path) ? "/"
            : path.StartsWith('/') ? path
            : $"/{path}";
        if (value.Equals("/home", StringComparison.OrdinalIgnoreCase))
        {
            value = "/";
        }
        var prefix = CultureCatalog.UrlPrefix(CultureInfo.CurrentUICulture.Name);
        return value.StartsWith(prefix, StringComparison.OrdinalIgnoreCase) || prefix.Length == 0
            ? value
            : $"{prefix}{(value == "/" ? string.Empty : value)}";
    }
}
