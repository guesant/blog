using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ResourceIdentifierConfiguration : IEntityTypeConfiguration<ResourceIdentifier>
{
    public void Configure(EntityTypeBuilder<ResourceIdentifier> builder)
    {
        builder.ToTable("resource_identifiers");
        builder.HasKey(identifier => identifier.Id);
        builder.Property(identifier => identifier.Id).HasColumnName("id");
        builder.Property(identifier => identifier.ResourceId).HasColumnName("resource_id");
        builder.Property(identifier => identifier.Kind).HasColumnName("kind").IsRequired();
        builder.Property(identifier => identifier.Value).HasColumnName("value").IsRequired();
        builder.Property(identifier => identifier.CreatedAt).HasColumnName("created_at");
        builder.Property(identifier => identifier.UpdatedAt).HasColumnName("updated_at");
    }
}
