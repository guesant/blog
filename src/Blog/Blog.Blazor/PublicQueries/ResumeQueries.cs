using Blog.Blazor.Data;

namespace Blog.Blazor.PublicQueries;

internal sealed record ResumeRow(
    int ResumeId,
    string? Summary,
    string? Leadership,
    string? Education,
    string? Certificates,
    string? Certifications,
    string? Publications,
    string? Recommendations,
    string? TechnicalProductions,
    string? Events,
    string? Awards
);

internal sealed record ResumeSkillRow(int Id, string Slug, string? Name);

internal sealed record ResumeLanguageRow(string Slug, string? Name, string? Proficiency);

internal static class ResumeQueries
{
    internal static ResumeRow? Resume(BlogPublicDbContext db, string locale) =>
        (
            from r in db.Resumes
            from t in db
                .ResumeTranslations.Where(t => t.ResumeId == r.Id && t.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .ResumeTranslations.Where(en => en.ResumeId == r.Id && en.Locale == "en")
                .DefaultIfEmpty()
            where t != null || en != null
            orderby r.Id
            select new ResumeRow(
                r.Id,
                t.Summary ?? en.Summary,
                t.Leadership ?? en.Leadership,
                t.Education ?? en.Education,
                t.Certificates ?? en.Certificates,
                t.Certifications ?? en.Certifications,
                t.Publications ?? en.Publications,
                t.Recommendations ?? en.Recommendations,
                t.TechnicalProductions ?? en.TechnicalProductions,
                t.Events ?? en.Events,
                t.Awards ?? en.Awards
            )
        ).FirstOrDefault();

    internal static List<string> SelectedCaseSlugs(BlogPublicDbContext db, int resumeId) =>
        (
            from x in db.ResumeSelectedCases
            join c in db.CaseStudies on x.CaseStudyId equals c.Id
            where x.ResumeId == resumeId
            orderby (x.Order == null ? 0 : 1), x.Order, x.CaseStudyId
            select c.Slug
        ).ToList();

    internal static List<ResumeSkillRow> Skills(
        BlogPublicDbContext db,
        int resumeId,
        string locale
    ) =>
        (
            from s in db.ResumeSkills
            join t in db.Topics on s.TopicId equals t.Id
            from tt in db
                .TopicTranslations.Where(tt => tt.TopicId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TopicTranslations.Where(en => en.TopicId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            where s.ResumeId == resumeId
            orderby (s.Order == null ? 0 : 1), s.Order, s.Id
            select new ResumeSkillRow(s.Id, t.Slug, tt.Name ?? en.Name)
        ).ToList();

    internal static List<OwnerTechnologyRow> SkillTechnologies(
        BlogPublicDbContext db,
        int resumeId,
        string locale
    ) =>
        (
            from p in db.ResumeSkillTechnologies
            join s in db.ResumeSkills on p.ResumeSkillId equals s.Id
            join t in db.Technologies on p.TechnologyId equals t.Id
            from tt in db
                .TechnologyTranslations.Where(tt => tt.TechnologyId == t.Id && tt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .TechnologyTranslations.Where(en => en.TechnologyId == t.Id && en.Locale == "en")
                .DefaultIfEmpty()
            where s.ResumeId == resumeId
            orderby p.ResumeSkillId, t.Order, t.Slug
            select new OwnerTechnologyRow(p.ResumeSkillId, t.Slug, tt.Name ?? en.Name)
        ).ToList();

    internal static List<ResumeLanguageRow> Languages(
        BlogPublicDbContext db,
        int resumeId,
        string locale
    ) =>
        (
            from x in db.ResumeLanguages
            join l in db.Languages on x.LanguageId equals l.Id
            from lt in db
                .LanguageTranslations.Where(lt => lt.LanguageId == l.Id && lt.Locale == locale)
                .DefaultIfEmpty()
            from en in db
                .LanguageTranslations.Where(en => en.LanguageId == l.Id && en.Locale == "en")
                .DefaultIfEmpty()
            where x.ResumeId == resumeId
            orderby (x.Order == null ? 0 : 1), x.Order, x.Id
            select new ResumeLanguageRow(l.Slug, lt.Name ?? en.Name, x.Proficiency)
        ).ToList();
}
