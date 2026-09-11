namespace Portfolio.Blazor.Stories.Stories.Composition;

public partial class SiteTranslationTabs_stories
{
    private static readonly IReadOnlyList<SiteLocaleTab> Locales =
    [
        new("en", "english"),
        new("pt-BR", "português"),
    ];
    private string _active = "en";
}
