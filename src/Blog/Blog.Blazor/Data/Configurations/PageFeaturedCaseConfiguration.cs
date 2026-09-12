using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class PageFeaturedCaseConfiguration : IEntityTypeConfiguration<PageFeaturedCase>
{
    public void Configure(EntityTypeBuilder<PageFeaturedCase> builder)
    {
        builder.ToTable("page_featured_case");
        builder.HasKey(featured => new { featured.PageId, featured.CaseStudyId });
        builder.Property(featured => featured.PageId).HasColumnName("page_id");
        builder.Property(featured => featured.CaseStudyId).HasColumnName("case_study_id");
        builder.Property(featured => featured.Order).HasColumnName("order");

        builder
            .HasOne(featured => featured.CaseStudy)
            .WithMany()
            .HasForeignKey(featured => featured.CaseStudyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
