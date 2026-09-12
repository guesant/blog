namespace Blog.Blazor.Data;

public static class TranslationLookup
{
    public static string? Resolve<TTranslation>(
        IEnumerable<TTranslation> translations,
        Func<TTranslation, string> localeSelector,
        Func<TTranslation, string?> valueSelector,
        string locale,
        string fallbackLocale = "en"
    )
    {
        var items = translations as IReadOnlyCollection<TTranslation> ?? [.. translations];

        var match = items.FirstOrDefault(item =>
            string.Equals(localeSelector(item), locale, StringComparison.OrdinalIgnoreCase)
        );
        var value = match is null ? null : valueSelector(match);
        if (!string.IsNullOrWhiteSpace(value))
            return value;

        var fallback = items.FirstOrDefault(item =>
            string.Equals(localeSelector(item), fallbackLocale, StringComparison.OrdinalIgnoreCase)
        );
        return fallback is null ? null : valueSelector(fallback);
    }
}
