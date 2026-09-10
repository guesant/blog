using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class ResumeConfiguration : IEntityTypeConfiguration<Resume>
{
    public void Configure(EntityTypeBuilder<Resume> builder)
    {
        builder.ToTable("resumes");
        builder.HasKey(resume => resume.Id);
        builder.Property(resume => resume.Id).HasColumnName("id");
        builder.Property(resume => resume.CreatedAt).HasColumnName("created_at");
        builder.Property(resume => resume.UpdatedAt).HasColumnName("updated_at");

        builder
            .HasMany(resume => resume.Translations)
            .WithOne(translation => translation.Resume)
            .HasForeignKey(translation => translation.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(resume => resume.Skills)
            .WithOne(skill => skill.Resume)
            .HasForeignKey(skill => skill.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(resume => resume.Languages)
            .WithOne(language => language.Resume)
            .HasForeignKey(language => language.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(resume => resume.SelectedCases)
            .WithOne(selected => selected.Resume)
            .HasForeignKey(selected => selected.ResumeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
