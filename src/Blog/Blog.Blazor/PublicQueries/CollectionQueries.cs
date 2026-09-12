using Blog.Blazor.Data;

namespace Blog.Blazor.PublicQueries;

internal sealed record CollectionRow(
    int Id,
    string Slug,
    string PublicId,
    DateOnly? PublishedAt,
    DateTime? UpdatedAt,
    DateTime? CreatedAt,
    string? Title,
    string? Description,
    string? Intro
);

internal sealed record CollectionItemRow(
    int CollectionId,
    int ResourceId,
    string Slug,
    string PublicId,
    string Type,
    string? Rating,
    string? Note,
    string? Title,
    string? Description
);

internal static class CollectionQueries
{
    internal static List<CollectionRow> Collections(BlogPublicDbContext db, string locale) =>
        (
            from c in db.ReferenceCollections
            from t in db
                .ReferenceCollectionTranslations.Where(t =>
                    t.ReferenceCollectionId == c.Id && t.Locale == locale
                )
                .DefaultIfEmpty()
            from en in db
                .ReferenceCollectionTranslations.Where(en =>
                    en.ReferenceCollectionId == c.Id && en.Locale == "en"
                )
                .DefaultIfEmpty()
            orderby c.Order, c.Id
            select new CollectionRow(
                c.Id,
                c.Slug,
                c.PublicId,
                c.PublishedAt,
                c.UpdatedAt,
                c.CreatedAt,
                t.Title ?? en.Title,
                t.Description ?? en.Description,
                t.Intro ?? en.Intro
            )
        ).ToList();

    internal static List<CollectionItemRow> Items(BlogPublicDbContext db, string locale) =>
        (
            from x in db.ReferenceCollectionItems
            join c in db.ReferenceCollections on x.ReferenceCollectionId equals c.Id
            join r in db.Resources on x.ResourceId equals r.Id
            from t in db
                .ResourceTranslations.Where(t => t.ResourceId == r.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .ResourceTranslations.Where(en => en.ResourceId == r.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby x.ReferenceCollectionId, (x.Order == null ? 0 : 1), x.Order, x.ResourceId
            select new CollectionItemRow(
                x.ReferenceCollectionId,
                r.Id,
                r.Slug,
                r.PublicId,
                r.Type,
                r.Rating,
                x.Note,
                t.Title ?? en.Title,
                t.Description ?? en.Description
            )
        ).ToList();

    internal static List<RelatedRow> RelatedRecent(BlogPublicDbContext db, int id, string locale) =>
        db
            .ReferenceCollections.Where(c => c.Id != id)
            .OrderBy(c => c.PublishedAt == null ? 1 : 0)
            .ThenByDescending(c => c.PublishedAt)
            .ThenBy(c => c.Id)
            .Take(3)
            .Select(c => new RelatedRow(
                c.Slug,
                c.PublicId,
                c.Translations.Where(t => t.Locale == locale).Select(t => t.Title).FirstOrDefault(),
                c.PublishedAt
            ))
            .ToList();
}
