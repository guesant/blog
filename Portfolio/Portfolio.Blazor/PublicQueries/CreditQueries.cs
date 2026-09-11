using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.PublicQueries;

internal sealed record CreditRow(
    string Category,
    string? Url,
    DateTime? CreatedAt,
    string? Name,
    string? Description
);

internal static class CreditQueries
{
    internal static List<CreditRow> Credits(PortfolioPublicDbContext db, string locale) =>
        (
            from c in db.CreditEntries
            from t in db
                .CreditEntryTranslations.Where(t => t.CreditEntryId == c.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .CreditEntryTranslations.Where(en => en.CreditEntryId == c.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby c.Category, c.Order, c.Id
            select new CreditRow(
                c.Category,
                c.Url,
                c.CreatedAt,
                t.Name ?? en.Name,
                t.Description ?? en.Description
            )
        ).ToList();
}
