using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class PageConfiguration : IEntityTypeConfiguration<Page>
{
    public void Configure(EntityTypeBuilder<Page> builder)
    {
        builder.ToTable("pages");
        builder.HasKey(page => page.Id);
        builder.Property(page => page.Id).HasColumnName("id");
        builder.Property(page => page.Slug).HasColumnName("slug").IsRequired();
        builder.Property(page => page.CreatedAt).HasColumnName("created_at");
        builder.Property(page => page.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(page => page.Slug).IsUnique().HasDatabaseName("pages_slug_unique");

        builder
            .HasMany(page => page.Translations)
            .WithOne(translation => translation.Page)
            .HasForeignKey(translation => translation.PageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(page => page.FeaturedCases)
            .WithOne(featured => featured.Page)
            .HasForeignKey(featured => featured.PageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(page => page.FeaturedProjects)
            .WithOne(featured => featured.Page)
            .HasForeignKey(featured => featured.PageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(page => page.FeaturedWritings)
            .WithOne(featured => featured.Page)
            .HasForeignKey(featured => featured.PageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
