using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class RelationTypeConfiguration : IEntityTypeConfiguration<RelationType>
{
    public void Configure(EntityTypeBuilder<RelationType> builder)
    {
        builder.ToTable("relation_types");
        builder.HasKey(relationType => relationType.Id);
        builder.Property(relationType => relationType.Id).HasColumnName("id");
        builder.Property(relationType => relationType.Key).HasColumnName("key").IsRequired();
        builder.Property(relationType => relationType.Family).HasColumnName("family").IsRequired();
        builder
            .Property(relationType => relationType.Symmetric)
            .HasColumnName("symmetric")
            .IsRequired();
        builder
            .Property(relationType => relationType.OutboundLabelEn)
            .HasColumnName("outbound_label_en")
            .IsRequired();
        builder
            .Property(relationType => relationType.OutboundLabelPtBr)
            .HasColumnName("outbound_label_pt_br")
            .IsRequired();
        builder
            .Property(relationType => relationType.InboundLabelEn)
            .HasColumnName("inbound_label_en")
            .IsRequired();
        builder
            .Property(relationType => relationType.InboundLabelPtBr)
            .HasColumnName("inbound_label_pt_br")
            .IsRequired();
        builder.Property(relationType => relationType.CreatedAt).HasColumnName("created_at");
        builder.Property(relationType => relationType.UpdatedAt).HasColumnName("updated_at");
        builder
            .HasIndex(relationType => relationType.Key)
            .IsUnique()
            .HasDatabaseName("relation_types_key_unique");
    }
}
