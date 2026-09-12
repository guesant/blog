using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class NavItemConfiguration : IEntityTypeConfiguration<NavItem>
{
    public void Configure(EntityTypeBuilder<NavItem> builder)
    {
        builder.ToTable("nav_items");
        builder.HasKey(navItem => navItem.Id);
        builder.Property(navItem => navItem.Id).HasColumnName("id");
        builder.Property(navItem => navItem.RouteName).HasColumnName("route_name").IsRequired();
        builder.Property(navItem => navItem.ParentId).HasColumnName("parent_id");
        builder.Property(navItem => navItem.Placement).HasColumnName("placement");
        builder.Property(navItem => navItem.SidebarGroup).HasColumnName("sidebar_group");
        builder.Property(navItem => navItem.Order).HasColumnName("order").HasDefaultValue(0);
        builder.Property(navItem => navItem.CreatedAt).HasColumnName("created_at");
        builder.Property(navItem => navItem.UpdatedAt).HasColumnName("updated_at");

        builder
            .HasOne<NavItem>()
            .WithMany()
            .HasForeignKey(navItem => navItem.ParentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasMany(navItem => navItem.Translations)
            .WithOne(translation => translation.NavItem)
            .HasForeignKey(translation => translation.NavItemId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
