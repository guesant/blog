using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ProjectTranslationConfiguration : IEntityTypeConfiguration<ProjectTranslation>
{
    public void Configure(EntityTypeBuilder<ProjectTranslation> builder)
    {
        builder.ToTable("project_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.ProjectId).HasColumnName("project_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Name).HasColumnName("name").IsRequired();
        builder.Property(translation => translation.Purpose).HasColumnName("purpose").IsRequired();
        builder.Property(translation => translation.Problem).HasColumnName("problem");
        builder.Property(translation => translation.CurrentFocus).HasColumnName("current_focus");
        builder.Property(translation => translation.Status).HasColumnName("status");
        builder.Property(translation => translation.Metrics).HasColumnName("metrics");
        builder.Property(translation => translation.Body).HasColumnName("body");
        builder.Property(translation => translation.Seo).HasColumnName("seo");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.ProjectId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("project_translations_project_id_locale_unique");
    }
}
