using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class TopicConfiguration : IEntityTypeConfiguration<Topic>
{
    public void Configure(EntityTypeBuilder<Topic> builder)
    {
        builder.ToTable("topics");
        builder.HasKey(topic => topic.Id);
        builder.Property(topic => topic.Id).HasColumnName("id");
        builder.Property(topic => topic.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(topic => topic.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(topic => topic.PublicId)
            .IsUnique()
            .HasDatabaseName("topics_public_id_unique");
        builder.Property(topic => topic.Order).HasColumnName("order");
        builder
            .Property(topic => topic.Kind)
            .HasColumnName("kind")
            .IsRequired()
            .HasDefaultValue("topic");
        builder.Property(topic => topic.ParentId).HasColumnName("parent_id");
        builder.Property(topic => topic.CreatedAt).HasColumnName("created_at");
        builder.Property(topic => topic.UpdatedAt).HasColumnName("updated_at");
        builder.HasIndex(topic => topic.Slug).IsUnique().HasDatabaseName("topics_slug_unique");

        builder
            .HasOne<Topic>()
            .WithMany()
            .HasForeignKey(topic => topic.ParentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(topic => topic.Translations)
            .WithOne(translation => translation.Topic)
            .HasForeignKey(translation => translation.TopicId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
