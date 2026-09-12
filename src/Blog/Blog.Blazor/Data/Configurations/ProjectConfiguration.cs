using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("projects");
        builder.HasKey(project => project.Id);
        builder.Property(project => project.Id).HasColumnName("id");
        builder.Property(project => project.Slug).HasColumnName("slug").IsRequired();
        builder
            .Property(project => project.PublicId)
            .HasColumnName("public_id")
            .IsRequired()
            .HasMaxLength(6);
        builder
            .HasIndex(project => project.PublicId)
            .IsUnique()
            .HasDatabaseName("projects_public_id_unique");
        builder.Property(project => project.Hidden).HasColumnName("hidden").HasDefaultValue(false);
        builder.Property(project => project.Order).HasColumnName("order");
        builder.Property(project => project.Href).HasColumnName("href");
        builder
            .Property(project => project.External)
            .HasColumnName("external")
            .HasDefaultValue(false);
        builder.Property(project => project.CreatedAt).HasColumnName("created_at");
        builder.Property(project => project.UpdatedAt).HasColumnName("updated_at");
        builder.Property(project => project.Nda).HasColumnName("nda").HasDefaultValue(false);
        builder.Property(project => project.PublishedAt).HasColumnName("published_at");
        builder
            .Property(project => project.ShowHistory)
            .HasColumnName("show_history")
            .HasDefaultValue(false);
        builder
            .HasIndex(project => project.Slug)
            .IsUnique()
            .HasDatabaseName("projects_slug_unique");

        builder
            .HasMany(project => project.Translations)
            .WithOne(translation => translation.Project)
            .HasForeignKey(translation => translation.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(project => project.ProjectTechnologies)
            .WithOne(projectTechnology => projectTechnology.Project)
            .HasForeignKey(projectTechnology => projectTechnology.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
