using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class TechnologyTranslationConfiguration
    : IEntityTypeConfiguration<TechnologyTranslation>
{
    public void Configure(EntityTypeBuilder<TechnologyTranslation> builder)
    {
        builder.ToTable("technology_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.TechnologyId).HasColumnName("technology_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Name).HasColumnName("name").IsRequired();
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.TechnologyId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("technology_translations_technology_id_locale_unique");
    }
}
