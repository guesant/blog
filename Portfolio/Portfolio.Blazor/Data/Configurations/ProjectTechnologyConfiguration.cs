using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ProjectTechnologyConfiguration : IEntityTypeConfiguration<ProjectTechnology>
{
    public void Configure(EntityTypeBuilder<ProjectTechnology> builder)
    {
        builder.ToTable("project_technology");
        builder.HasKey(projectTechnology => new
        {
            projectTechnology.ProjectId,
            projectTechnology.TechnologyId,
        });
        builder
            .Property(projectTechnology => projectTechnology.ProjectId)
            .HasColumnName("project_id");
        builder
            .Property(projectTechnology => projectTechnology.TechnologyId)
            .HasColumnName("technology_id");
        builder
            .Property(projectTechnology => projectTechnology.Order)
            .HasColumnName("order")
            .HasDefaultValue(0);

        builder
            .HasOne(projectTechnology => projectTechnology.Technology)
            .WithMany()
            .HasForeignKey(projectTechnology => projectTechnology.TechnologyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
