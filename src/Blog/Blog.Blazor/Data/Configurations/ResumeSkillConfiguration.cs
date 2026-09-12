using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ResumeSkillConfiguration : IEntityTypeConfiguration<ResumeSkill>
{
    public void Configure(EntityTypeBuilder<ResumeSkill> builder)
    {
        builder.ToTable("resume_skills");
        builder.HasKey(skill => skill.Id);
        builder.Property(skill => skill.Id).HasColumnName("id");
        builder.Property(skill => skill.ResumeId).HasColumnName("resume_id");
        builder.Property(skill => skill.Order).HasColumnName("order");
        builder.Property(skill => skill.TopicId).HasColumnName("topic_id");
        builder.Property(skill => skill.CreatedAt).HasColumnName("created_at");
        builder.Property(skill => skill.UpdatedAt).HasColumnName("updated_at");

        builder
            .HasOne(skill => skill.Topic)
            .WithMany()
            .HasForeignKey(skill => skill.TopicId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(skill => skill.SkillTechnologies)
            .WithOne(skillTechnology => skillTechnology.ResumeSkill)
            .HasForeignKey(skillTechnology => skillTechnology.ResumeSkillId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
