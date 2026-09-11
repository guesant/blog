using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class PageFeaturedProjectConfiguration : IEntityTypeConfiguration<PageFeaturedProject>
{
    public void Configure(EntityTypeBuilder<PageFeaturedProject> builder)
    {
        builder.ToTable("page_featured_project");
        builder.HasKey(featured => new { featured.PageId, featured.ProjectId });
        builder.Property(featured => featured.PageId).HasColumnName("page_id");
        builder.Property(featured => featured.ProjectId).HasColumnName("project_id");
        builder.Property(featured => featured.Order).HasColumnName("order");

        builder
            .HasOne(featured => featured.Project)
            .WithMany()
            .HasForeignKey(featured => featured.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
