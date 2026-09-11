using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Portfolio.Blazor.Data.Entities;

namespace Portfolio.Blazor.Data.Configurations;

public sealed class AuditRequestConfiguration : IEntityTypeConfiguration<AuditRequest>
{
    public void Configure(EntityTypeBuilder<AuditRequest> builder)
    {
        builder.ToTable("audit_requests");
        builder.HasKey(request => request.RequestId);
        builder.Property(request => request.RequestId).HasColumnName("request_id");
        builder.Property(request => request.Method).HasColumnName("method").IsRequired();
        builder.Property(request => request.Path).HasColumnName("path").IsRequired();
        builder.Property(request => request.Ip).HasColumnName("ip");
        builder.Property(request => request.UserAgent).HasColumnName("user_agent");
        builder.Property(request => request.CreatedAt).HasColumnName("created_at");
    }
}
