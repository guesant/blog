using Blog.Blazor.Data;

namespace Blog.Blazor.PublicQueries;

internal sealed record FindingRow(
    int Id,
    string Slug,
    string PublicId,
    string Type,
    string? Authors,
    string? Organizations,
    DateOnly? PublishedDateIso,
    DateOnly? FoundDateIso,
    string? Rating,
    string? ConsumptionState,
    string? TypeDetails,
    DateTime? UpdatedAt,
    string? Title,
    string? AlternativeTitle,
    string? Description,
    string? PersonalNote,
    string? ReasonFound,
    long? PopularityValue,
    string? PopularityKind,
    double? PopularityRank,
    bool Featured,
    int? FeaturedOrder
);

internal sealed record FindingLinkRow(
    int ResourceId,
    string Url,
    string? Label,
    string? Platform,
    string? Purpose,
    bool IsFree,
    bool IsPrimary
);

internal sealed record IdentifierRow(int ResourceId, string Kind, string Value);

internal sealed record AttributionRow(int ResourceId, string Slug, string PublicId, string? Name);

internal sealed record RelatedFindingRow(
    string Slug,
    string PublicId,
    string? Title,
    DateOnly? Date
);

internal static class FindingQueries
{
    internal static List<FindingRow> Findings(BlogPublicDbContext db, string locale) =>
        (
            from r in db.Resources
            from t in db
                .ResourceTranslations.Where(t => t.ResourceId == r.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .ResourceTranslations.Where(en => en.ResourceId == r.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby r.Order, r.Id
            select new FindingRow(
                r.Id,
                r.Slug,
                r.PublicId,
                r.Type,
                r.Authors,
                r.Organizations,
                r.PublishedDateIso,
                r.FoundDateIso,
                r.Rating,
                r.ConsumptionState,
                r.TypeDetails,
                r.UpdatedAt,
                t.Title ?? en.Title,
                t.AlternativeTitle ?? en.AlternativeTitle,
                t.Description ?? en.Description,
                t.PersonalNote ?? en.PersonalNote,
                t.ReasonFound ?? en.ReasonFound,
                r.PopularityValue,
                r.PopularityKind,
                r.PopularityRank,
                r.Featured,
                r.FeaturedOrder
            )
        ).ToList();

    internal static List<FindingLinkRow> Links(BlogPublicDbContext db) =>
        (
            from l in db.ResourceLinks
            join r in db.Resources on l.ResourceId equals r.Id
            orderby l.ResourceId, l.Id
            select new FindingLinkRow(
                l.ResourceId,
                l.Url,
                l.Label,
                l.Platform,
                l.Purpose,
                l.IsFree,
                l.IsPrimary
            )
        ).ToList();

    internal static List<IdentifierRow> Identifiers(BlogPublicDbContext db) =>
        (
            from i in db.ResourceIdentifiers
            join r in db.Resources on i.ResourceId equals r.Id
            orderby i.ResourceId, i.Id
            select new IdentifierRow(i.ResourceId, i.Kind, i.Value)
        ).ToList();

    internal static List<AttributionRow> AttributionTopics(BlogPublicDbContext db, string locale) =>
        (
            from rel in db.ContentRelations
            join rt in db.RelationTypes on rel.RelationTypeId equals rt.Id
            join t in db.Topics on rel.ObjectId equals t.Id
            join r in db.Resources on rel.SubjectId equals r.Id
            from tt in db
                .TopicTranslations.Where(tt => tt.TopicId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TopicTranslations.Where(en => en.TopicId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            where
                rel.SubjectType == "finding"
                && rel.ObjectType == "topic"
                && (rt.Key == "authored-by" || rt.Key == "published-by")
                && (rel.Visibility == null || rel.Visibility == "public")
            orderby rel.SubjectId, t.Order, t.Slug
            select new AttributionRow(rel.SubjectId, t.Slug, t.PublicId, tt.Name ?? en.Name)
        ).ToList();

    internal static List<RelatedFindingRow> RelatedByTopic(
        BlogPublicDbContext db,
        int id,
        string locale
    )
    {
        var topicId = db
            .Topicables.Where(x => x.TopicableType == "finding" && x.TopicableId == id)
            .OrderBy(x => x.Id)
            .Select(x => (int?)x.TopicId)
            .FirstOrDefault();
        if (topicId is null)
            return [];
        return db
            .Resources.Where(r =>
                r.Id != id
                && db.Topicables.Any(link =>
                    link.TopicId == topicId
                    && link.TopicableType == "finding"
                    && link.TopicableId == r.Id
                )
            )
            .OrderBy(r => r.PublishedDateIso == null ? 1 : 0)
            .ThenByDescending(r => r.PublishedDateIso)
            .ThenBy(r => r.Id)
            .Take(3)
            .Select(r => new RelatedFindingRow(
                r.Slug,
                r.PublicId,
                r.Translations.Where(t => t.Locale == locale).Select(t => t.Title).FirstOrDefault(),
                r.PublishedDateIso
            ))
            .ToList();
    }

    internal static List<RelatedFindingRow> RelatedByType(
        BlogPublicDbContext db,
        int id,
        string type,
        string locale
    ) =>
        db
            .Resources.Where(r => r.Id != id && r.Type == type)
            .OrderBy(r => r.PublishedDateIso == null ? 1 : 0)
            .ThenByDescending(r => r.PublishedDateIso)
            .ThenBy(r => r.Id)
            .Take(3)
            .Select(r => new RelatedFindingRow(
                r.Slug,
                r.PublicId,
                r.Translations.Where(t => t.Locale == locale).Select(t => t.Title).FirstOrDefault(),
                r.PublishedDateIso
            ))
            .ToList();
}
