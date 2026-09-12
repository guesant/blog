using Blog.Blazor.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Blazor.Data.Configurations;

public sealed class ResumeLanguageConfiguration : IEntityTypeConfiguration<ResumeLanguage>
{
    public void Configure(EntityTypeBuilder<ResumeLanguage> builder)
    {
        builder.ToTable("resume_languages");
        builder.HasKey(language => language.Id);
        builder.Property(language => language.Id).HasColumnName("id");
        builder.Property(language => language.ResumeId).HasColumnName("resume_id");
        builder.Property(language => language.LanguageId).HasColumnName("language_id");
        builder.Property(language => language.Proficiency).HasColumnName("proficiency");
        builder.Property(language => language.Order).HasColumnName("order");
        builder.Property(language => language.CreatedAt).HasColumnName("created_at");
        builder.Property(language => language.UpdatedAt).HasColumnName("updated_at");

        builder
            .HasOne(language => language.Language)
            .WithMany()
            .HasForeignKey(language => language.LanguageId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
