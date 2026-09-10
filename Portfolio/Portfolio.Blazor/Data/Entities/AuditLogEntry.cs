namespace Portfolio.Blazor.Data.Entities;

public sealed class AuditLogEntry
{
    public int Id { get; set; }
    public string AuditableType { get; set; } = string.Empty;
    public int AuditableId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? RequestId { get; set; }
    public string? Ip { get; set; }
    public string? UserAgent { get; set; }
    public DateTime? CreatedAt { get; set; }
}
