using Blog.Blazor.Core;
using Blog.Blazor.Core.Localization;
using Microsoft.Extensions.Localization;

namespace Blog.Blazor.Client.Shared;

public static class PopularityFormat
{
    public static string? Label(PublicPopularity? popularity, IStringLocalizer<SharedResource> l)
    {
        if (popularity is null)
            return null;

        var unit = popularity.Kind.ToLowerInvariant() switch
        {
            "stars" or "star" => l["stars"],
            "views" or "view" => l["views"],
            _ => l["points"],
        };

        return $"{FormatCount(popularity.Value)} {unit}";
    }

    private static string FormatCount(long value)
    {
        return value switch
        {
            >= 1_000_000 => $"{value / 1_000_000.0:0.#}M",
            >= 1_000 => $"{value / 1_000.0:0.#}k",
            _ => value.ToString("N0", CultureInfo.InvariantCulture),
        };
    }
}
