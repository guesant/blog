using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class TopicableConfiguration : IEntityTypeConfiguration<Topicable>
{
    public void Configure(EntityTypeBuilder<Topicable> builder)
    {
        builder.ToTable("topicables");
        builder.HasKey(topicable => topicable.Id);
        builder.Property(topicable => topicable.Id).HasColumnName("id");
        builder.Property(topicable => topicable.TopicId).HasColumnName("topic_id");
        builder
            .Property(topicable => topicable.TopicableType)
            .HasColumnName("topicable_type")
            .IsRequired();
        builder.Property(topicable => topicable.TopicableId).HasColumnName("topicable_id");
        builder.Property(topicable => topicable.Role).HasColumnName("role");
        builder
            .HasIndex(topicable => new
            {
                topicable.TopicId,
                topicable.TopicableType,
                topicable.TopicableId,
            })
            .IsUnique()
            .HasDatabaseName("topicables_topic_id_topicable_type_topicable_id_unique");
        builder
            .HasIndex(topicable => new { topicable.TopicableType, topicable.TopicableId })
            .HasDatabaseName("topicables_topicable_type_topicable_id_index");

        builder
            .HasOne(topicable => topicable.Topic)
            .WithMany()
            .HasForeignKey(topicable => topicable.TopicId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
