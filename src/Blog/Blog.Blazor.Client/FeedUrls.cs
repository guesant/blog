using Blog.Blazor.Core.Localization;

namespace Blog.Blazor.Client;

public static class FeedUrls
{
    public const string Writing = "post";
    public const string Finding = "achado";
    public const string Collection = "colecao";

    public static string Home => LocalizedUrls.Current("/");

    public static string ForKind(string kind) =>
        kind switch
        {
            Writing => LocalizedUrls.Current("/writing"),
            Finding => LocalizedUrls.Current("/findings"),
            Collection => LocalizedUrls.Current("/collections"),
            _ => $"{Home}?kind={kind}",
        };
}
