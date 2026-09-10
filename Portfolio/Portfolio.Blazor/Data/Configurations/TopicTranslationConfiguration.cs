using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class TopicTranslationConfiguration : IEntityTypeConfiguration<TopicTranslation>
{
    public void Configure(EntityTypeBuilder<TopicTranslation> builder)
    {
        builder.ToTable("topic_translations");
        builder.HasKey(translation => translation.Id);
        builder.Property(translation => translation.Id).HasColumnName("id");
        builder.Property(translation => translation.TopicId).HasColumnName("topic_id");
        builder.Property(translation => translation.Locale).HasColumnName("locale").IsRequired();
        builder.Property(translation => translation.Name).HasColumnName("name").IsRequired();
        builder.Property(translation => translation.CreatedAt).HasColumnName("created_at");
        builder.Property(translation => translation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(translation => new { translation.TopicId, translation.Locale })
            .IsUnique()
            .HasDatabaseName("topic_translations_topic_id_locale_unique");
    }
}
