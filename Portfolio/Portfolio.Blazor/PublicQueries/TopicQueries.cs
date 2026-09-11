using Portfolio.Blazor.Data;

namespace Portfolio.Blazor.PublicQueries;

internal sealed record TopicRow(int Id, string Slug, string PublicId, string? Name);

internal sealed record TechnologyRow(
    int Id,
    string Slug,
    string PublicId,
    string? Code,
    string? Name
);

internal sealed record ResumeSkillTopicRow(
    int TechnologyId,
    string Slug,
    string PublicId,
    string? Name
);

internal static class TopicQueries
{
    internal static List<TopicRow> Topics(PortfolioPublicDbContext db, string locale) =>
        (
            from t in db.Topics
            from tt in db
                .TopicTranslations.Where(tt => tt.TopicId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TopicTranslations.Where(en => en.TopicId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby t.Order, t.Id
            select new TopicRow(t.Id, t.Slug, t.PublicId, tt.Name ?? en.Name)
        ).ToList();

    internal static List<TechnologyRow> Technologies(PortfolioPublicDbContext db, string locale) =>
        (
            from t in db.Technologies
            from tt in db
                .TechnologyTranslations.Where(tt => tt.TechnologyId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TechnologyTranslations.Where(en => en.TechnologyId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby t.Order, t.Id
            select new TechnologyRow(t.Id, t.Slug, t.PublicId, t.Code, tt.Name ?? en.Name)
        ).ToList();

    internal static List<ResumeSkillTopicRow> ResumeSkillTopics(
        PortfolioPublicDbContext db,
        string locale
    ) =>
        (
            from x in db.ResumeSkillTechnologies
            join s in db.ResumeSkills on x.ResumeSkillId equals s.Id
            join t in db.Topics on s.TopicId equals t.Id
            from tt in db
                .TopicTranslations.Where(tt => tt.TopicId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TopicTranslations.Where(en => en.TopicId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            orderby x.TechnologyId, (s.Order == null ? 0 : 1), s.Order, t.Order, s.Id
            select new ResumeSkillTopicRow(x.TechnologyId, t.Slug, t.PublicId, tt.Name ?? en.Name)
        ).ToList();
}
