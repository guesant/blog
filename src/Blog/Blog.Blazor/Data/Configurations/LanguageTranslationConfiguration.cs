using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class LanguageTranslationConfiguration : IEntityTypeConfiguration<LanguageTranslation>
{
    public void Configure(EntityTypeBuilder<LanguageTranslation> builder)
    {
        builder.ToTable("language_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.LanguageId).HasColumnName("language_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Name).HasColumnName("name").IsRequired();
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.LanguageId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("language_translations_language_id_locale_unique");
    }
}
