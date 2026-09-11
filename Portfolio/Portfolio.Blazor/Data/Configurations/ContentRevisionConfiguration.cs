using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ContentRevisionConfiguration : IEntityTypeConfiguration<ContentRevision>
{
    public void Configure(EntityTypeBuilder<ContentRevision> builder)
    {
        builder.ToTable("content_revisions");
        builder.HasKey(revision => revision.Id);
        builder.Property(revision => revision.Id).HasColumnName("id").ValueGeneratedNever();
        builder.Property(revision => revision.Version).HasColumnName("version");
        builder.Property(revision => revision.UpdatedAt).HasColumnName("updated_at");
    }
}
