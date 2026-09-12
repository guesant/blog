using Blog.Blazor.Data;

namespace Blog.Blazor.PublicQueries;

internal sealed record GraphNodeRow(int Id, string Slug, string PublicId, string? Label);

internal sealed record TopicEdgeRow(
    int TopicId,
    string TopicableType,
    int TopicableId,
    string? Role
);

internal sealed record TechnologyEdgeRow(int OwnerId, int TechnologyId);

internal sealed record CollectionEdgeRow(int CollectionId, int ResourceId);

internal sealed record RelationEdgeRow(
    string SubjectType,
    int SubjectId,
    string ObjectType,
    int ObjectId,
    string? Note,
    string? Context,
    string? Status,
    string Key,
    string Family,
    bool Symmetric,
    string OutboundLabelEn,
    string OutboundLabelPtBr,
    string InboundLabelEn,
    string InboundLabelPtBr
);

internal static class GraphQueries
{
    internal static IReadOnlyList<(string Kind, List<GraphNodeRow> Rows)> Nodes(
        BlogPublicDbContext db,
        string locale
    ) =>
        [
            (
                "topic",
                db.Topics.OrderBy(x => x.Order)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Name)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
            (
                "technology",
                db.Technologies.OrderBy(x => x.Order)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Name)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
            (
                "project",
                db.Projects.OrderBy(x => x.Order)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Name)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
            (
                "case-study",
                db.CaseStudies.OrderBy(x => x.Order)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Title)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
            (
                "writing",
                db.Writings.OrderBy(x => x.DateIso == null ? 1 : 0)
                    .ThenByDescending(x => x.DateIso)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Title)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
            (
                "finding",
                db.Resources.OrderBy(x => x.Order)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Title)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
            (
                "experiment",
                db.Experiments.OrderBy(x => x.Order)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Name)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
            (
                "snippet",
                db.Snippets.OrderBy(x => x.Order)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Title)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
            (
                "collection",
                db.ReferenceCollections.OrderBy(x => x.Order)
                    .ThenBy(x => x.Id)
                    .Select(x => new GraphNodeRow(
                        x.Id,
                        x.Slug,
                        x.PublicId,
                        x.Translations.Where(t => t.Locale == locale)
                            .Select(t => t.Title)
                            .FirstOrDefault()
                    ))
                    .ToList()
            ),
        ];

    internal static List<TopicEdgeRow> TopicEdges(BlogPublicDbContext db) =>
        db
            .Topicables.OrderBy(x => x.Id)
            .Select(x => new TopicEdgeRow(x.TopicId, x.TopicableType, x.TopicableId, x.Role))
            .ToList();

    internal static IReadOnlyList<(string Kind, List<TechnologyEdgeRow> Rows)> TechnologyEdges(
        BlogPublicDbContext db
    ) =>
        [
            (
                "project",
                db.ProjectTechnologies.OrderBy(x => x.ProjectId)
                    .ThenBy(x => x.TechnologyId)
                    .Select(x => new TechnologyEdgeRow(x.ProjectId, x.TechnologyId))
                    .ToList()
            ),
            (
                "case-study",
                db.CaseStudyTechnologies.OrderBy(x => x.CaseStudyId)
                    .ThenBy(x => x.TechnologyId)
                    .Select(x => new TechnologyEdgeRow(x.CaseStudyId, x.TechnologyId))
                    .ToList()
            ),
            (
                "experiment",
                db.ExperimentTechnologies.OrderBy(x => x.ExperimentId)
                    .ThenBy(x => x.TechnologyId)
                    .Select(x => new TechnologyEdgeRow(x.ExperimentId, x.TechnologyId))
                    .ToList()
            ),
        ];

    internal static List<CollectionEdgeRow> CollectionEdges(BlogPublicDbContext db) =>
        db
            .ReferenceCollectionItems.OrderBy(x => x.ReferenceCollectionId)
            .ThenBy(x => x.ResourceId)
            .Select(x => new CollectionEdgeRow(x.ReferenceCollectionId, x.ResourceId))
            .ToList();

    internal static List<RelationEdgeRow> RelationEdges(BlogPublicDbContext db) =>
        (
            from r in db.ContentRelations
            join t in db.RelationTypes on r.RelationTypeId equals t.Id
            where r.Visibility == null || r.Visibility == "public"
            orderby r.Id
            select new RelationEdgeRow(
                r.SubjectType,
                r.SubjectId,
                r.ObjectType,
                r.ObjectId,
                r.Note,
                r.Context,
                r.Status,
                t.Key,
                t.Family,
                t.Symmetric,
                t.OutboundLabelEn,
                t.OutboundLabelPtBr,
                t.InboundLabelEn,
                t.InboundLabelPtBr
            )
        ).ToList();
}
