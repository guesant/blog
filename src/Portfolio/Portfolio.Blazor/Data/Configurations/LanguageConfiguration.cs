using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class LanguageConfiguration : IEntityTypeConfiguration<Language>
{
    public void Configure(EntityTypeBuilder<Language> builder)
    {
        builder.ToTable("languages");
        builder.HasKey(language => language.Id);
        builder.Property(language => language.Id).HasColumnName("id");
        builder.Property(language => language.Slug).HasColumnName("slug").IsRequired();
        builder.Property(language => language.Order).HasColumnName("order");
        builder.Property(language => language.Code).HasColumnName("code").IsRequired();
        builder.Property(language => language.CreatedAt).HasColumnName("created_at");
        builder.Property(language => language.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(language => language.Slug)
            .IsUnique()
            .HasDatabaseName("languages_slug_unique");

        builder
            .HasMany(language => language.Translations)
            .WithOne(translation => translation.Language)
            .HasForeignKey(translation => translation.LanguageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
