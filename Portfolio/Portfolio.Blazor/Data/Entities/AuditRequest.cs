namespace Portfolio.Blazor.Data.Entities;

public sealed class AuditRequest
{
    public string RequestId { get; set; } = string.Empty;
    public string Method { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string? Ip { get; set; }
    public string? UserAgent { get; set; }
    public DateTime? CreatedAt { get; set; }
}
