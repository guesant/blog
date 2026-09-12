using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages.CaseStudies;

public partial class CaseStudyList
{
    protected override string EntityLabel => "case study";

    protected override void SetOrder(CaseStudy entity, int order) => entity.Order = order;

    protected override async Task<List<CaseStudy>> LoadEntitiesAsync(
        BlogAdminDbContext dbContext
    ) =>
        await dbContext
            .CaseStudies.Include(caseStudy => caseStudy.Translations)
            .AsNoTracking()
            .OrderBy(caseStudy => caseStudy.Order)
            .ThenBy(caseStudy => caseStudy.Slug)
            .ToListAsync();

    protected override Task<CaseStudy?> FindTrackedAsync(BlogAdminDbContext dbContext, int id) =>
        dbContext.CaseStudies.FirstOrDefaultAsync(candidate => candidate.Id == id);

    protected override string DisplayTitle(CaseStudy caseStudy) =>
        TranslationLookup.Resolve(
            caseStudy.Translations,
            translation => translation.Locale,
            translation => translation.Title,
            "en"
        ) ?? caseStudy.Slug;

    protected override int GetId(CaseStudy caseStudy) => caseStudy.Id;

    protected override string DeleteConfirmDescription(CaseStudy entity) =>
        "This permanently removes the case study, its translations and its technology links. This cannot be undone.";
}
