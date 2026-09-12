using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ContentRelationConfiguration : IEntityTypeConfiguration<ContentRelation>
{
    public void Configure(EntityTypeBuilder<ContentRelation> builder)
    {
        builder.ToTable("content_relations");
        builder.HasKey(relation => relation.Id);
        builder.Property(relation => relation.Id).HasColumnName("id");
        builder
            .Property(relation => relation.RelationTypeId)
            .HasColumnName("relation_type_id")
            .IsRequired();
        builder
            .Property(relation => relation.SubjectType)
            .HasColumnName("subject_type")
            .IsRequired();
        builder.Property(relation => relation.SubjectId).HasColumnName("subject_id").IsRequired();
        builder.Property(relation => relation.ObjectType).HasColumnName("object_type").IsRequired();
        builder.Property(relation => relation.ObjectId).HasColumnName("object_id").IsRequired();
        builder.Property(relation => relation.Note).HasColumnName("note");
        builder.Property(relation => relation.Context).HasColumnName("context");
        builder
            .Property(relation => relation.Status)
            .HasColumnName("status")
            .HasDefaultValue("verified");
        builder.Property(relation => relation.Visibility).HasColumnName("visibility");
        builder.Property(relation => relation.CreatedAt).HasColumnName("created_at");
        builder.Property(relation => relation.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(relation => new { relation.SubjectType, relation.SubjectId })
            .HasDatabaseName("content_relations_subject_type_subject_id_index")
            .HasDatabaseName("content_relations_subject_type_subject_id_index");
        builder
            .HasIndex(relation => new { relation.ObjectType, relation.ObjectId })
            .HasDatabaseName("content_relations_object_type_object_id_index")
            .HasDatabaseName("content_relations_object_type_object_id_index");

        builder
            .HasOne(relation => relation.RelationType)
            .WithMany(relationType => relationType.Relations)
            .HasForeignKey(relation => relation.RelationTypeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
