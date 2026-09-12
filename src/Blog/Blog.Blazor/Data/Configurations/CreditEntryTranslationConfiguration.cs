using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class CreditEntryTranslationConfiguration
    : IEntityTypeConfiguration<CreditEntryTranslation>
{
    public void Configure(EntityTypeBuilder<CreditEntryTranslation> builder)
    {
        builder.ToTable("credit_entry_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.CreditEntryId).HasColumnName("credit_entry_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Name).HasColumnName("name").IsRequired();
        builder.Property(translation => translation.Description).HasColumnName("description");
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.CreditEntryId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("credit_entry_translations_credit_entry_id_locale_unique");
    }
}
