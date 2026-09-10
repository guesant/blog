using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ReferenceCollectionItemConfiguration
    : IEntityTypeConfiguration<ReferenceCollectionItem>
{
    public void Configure(EntityTypeBuilder<ReferenceCollectionItem> builder)
    {
        builder.ToTable("reference_collection_item");
        builder.HasKey(item => new { item.ReferenceCollectionId, item.ResourceId });
        builder
            .Property(item => item.ReferenceCollectionId)
            .HasColumnName("reference_collection_id");
        builder.Property(item => item.ResourceId).HasColumnName("resource_id");
        builder.Property(item => item.Note).HasColumnName("note");
        builder.Property(item => item.Order).HasColumnName("order");

        builder
            .HasOne(item => item.Resource)
            .WithMany()
            .HasForeignKey(item => item.ResourceId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
