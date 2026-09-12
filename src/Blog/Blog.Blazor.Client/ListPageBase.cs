using Microsoft.AspNetCore.Components;

namespace Blog.Blazor.Client;

public abstract class ListPageBase : ContentPageBase
{
    protected string ListingSummary(int shown, int total, int page, int pages) =>
        L["listing_summary", shown, total, page, pages];

    protected void HandleApply(string action, string sortValue, bool denseView) =>
        HandleApply(action, sortValue, null, denseView);

    protected void HandleApply(string action, string sortValue, string? search, bool denseView) =>
        Navigation.NavigateTo(ListingUrl(action, sortValue, search, denseView, 1));

    protected static string ListingUrl(
        string action,
        string sortValue,
        string? search,
        bool denseView,
        int page
    )
    {
        var query = new List<string> { $"sort={Uri.EscapeDataString(sortValue)}" };
        if (!string.IsNullOrWhiteSpace(search))
        {
            query.Add($"q={Uri.EscapeDataString(search.Trim())}");
        }
        if (denseView)
        {
            query.Add("view=dense");
        }
        if (page > 1)
        {
            query.Add($"page={page}");
        }
        return $"{action}?{string.Join('&', query)}";
    }

    protected static bool MatchesSearch(string? search, params string?[] fields)
    {
        if (string.IsNullOrWhiteSpace(search))
        {
            return true;
        }
        var needle = search.Trim();
        return fields.Any(field =>
            !string.IsNullOrWhiteSpace(field)
            && field.Contains(needle, StringComparison.OrdinalIgnoreCase)
        );
    }

    protected static int PageCountFor(int totalItems, int pageSize)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(totalItems);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(pageSize);
        return Math.Max(1, (int)Math.Ceiling(totalItems / (double)pageSize));
    }

    protected static int CurrentPageFor(int? requestedPage, int pageCount) =>
        Math.Clamp(requestedPage.GetValueOrDefault(1), 1, Math.Max(1, pageCount));

    protected static IReadOnlyList<T> ItemsForPage<T>(
        IEnumerable<T> items,
        int currentPage,
        int pageSize
    )
    {
        ArgumentNullException.ThrowIfNull(items);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(pageSize);
        return items.Skip((Math.Max(1, currentPage) - 1) * pageSize).Take(pageSize).ToArray();
    }
}
