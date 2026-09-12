using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class PageFeaturedWritingConfiguration : IEntityTypeConfiguration<PageFeaturedWriting>
{
    public void Configure(EntityTypeBuilder<PageFeaturedWriting> builder)
    {
        builder.ToTable("page_featured_writing");
        builder.HasKey(featured => new { featured.PageId, featured.WritingId });
        builder.Property(featured => featured.PageId).HasColumnName("page_id");
        builder.Property(featured => featured.WritingId).HasColumnName("writing_id");
        builder.Property(featured => featured.Order).HasColumnName("order");

        builder
            .HasOne(featured => featured.Writing)
            .WithMany()
            .HasForeignKey(featured => featured.WritingId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
