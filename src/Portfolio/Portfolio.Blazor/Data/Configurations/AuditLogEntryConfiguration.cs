using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class AuditLogEntryConfiguration : IEntityTypeConfiguration<AuditLogEntry>
{
    public void Configure(EntityTypeBuilder<AuditLogEntry> builder)
    {
        builder.ToTable("audit_log");
        builder.HasKey(entry => entry.Id);
        builder.Property(entry => entry.Id).HasColumnName("id");
        builder.Property(entry => entry.AuditableType).HasColumnName("auditable_type").IsRequired();
        builder.Property(entry => entry.AuditableId).HasColumnName("auditable_id").IsRequired();
        builder.Property(entry => entry.Action).HasColumnName("action").IsRequired();
        builder.Property(entry => entry.OldValues).HasColumnName("old_values");
        builder.Property(entry => entry.NewValues).HasColumnName("new_values");
        builder.Property(entry => entry.RequestId).HasColumnName("request_id");
        builder.Property(entry => entry.Ip).HasColumnName("ip");
        builder.Property(entry => entry.UserAgent).HasColumnName("user_agent");
        builder.Property(entry => entry.CreatedAt).HasColumnName("created_at");
        builder
            .HasIndex(entry => new { entry.AuditableType, entry.AuditableId })
            .HasDatabaseName("audit_log_auditable_type_auditable_id_index");
    }
}
