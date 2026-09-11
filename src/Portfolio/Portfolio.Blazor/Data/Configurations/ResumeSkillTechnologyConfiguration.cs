using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ResumeSkillTechnologyConfiguration
    : IEntityTypeConfiguration<ResumeSkillTechnology>
{
    public void Configure(EntityTypeBuilder<ResumeSkillTechnology> builder)
    {
        builder.ToTable("resume_skill_technology");
        builder.HasKey(skillTechnology => new
        {
            skillTechnology.ResumeSkillId,
            skillTechnology.TechnologyId,
        });
        builder
            .Property(skillTechnology => skillTechnology.ResumeSkillId)
            .HasColumnName("resume_skill_id");
        builder
            .Property(skillTechnology => skillTechnology.TechnologyId)
            .HasColumnName("technology_id");

        builder
            .HasOne(skillTechnology => skillTechnology.Technology)
            .WithMany()
            .HasForeignKey(skillTechnology => skillTechnology.TechnologyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
