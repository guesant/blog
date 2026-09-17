using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Blog.Blazor.Data;

internal static class PublicVisibilityFilters
{
    internal static void Apply(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Project>().HasQueryFilter(project => !project.Hidden && !project.Nda);
        modelBuilder
            .Entity<CaseStudy>()
            .HasQueryFilter(caseStudy => !caseStudy.Hidden && !caseStudy.Nda);
        modelBuilder.Entity<Writing>().HasQueryFilter(writing => !writing.Hidden);
        modelBuilder.Entity<Experiment>().HasQueryFilter(experiment => !experiment.Hidden);
        modelBuilder.Entity<Snippet>().HasQueryFilter(snippet => !snippet.Hidden);
        modelBuilder.Entity<ReferenceCollection>().HasQueryFilter(collection => !collection.Hidden);
        modelBuilder
            .Entity<Resource>()
            .HasQueryFilter(resource => !resource.Hidden && resource.Visibility == "public");
        modelBuilder.Entity<CreditEntry>().HasQueryFilter(credit => credit.Active);
        modelBuilder.Entity<Topic>().HasQueryFilter(topic => !topic.Hidden);
        modelBuilder.Entity<Profile>().HasQueryFilter(profile => !profile.Hidden);
        modelBuilder.Entity<Resume>().HasQueryFilter(resume => !resume.Hidden);
        modelBuilder.Entity<Technology>().HasQueryFilter(technology => !technology.Hidden);
        modelBuilder.Entity<Page>().HasQueryFilter(page => !page.Hidden);
    }
}
