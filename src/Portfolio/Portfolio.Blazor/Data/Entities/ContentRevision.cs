namespace Portfolio.Blazor.Data.Entities;

public sealed class ContentRevision
{
    public int Id { get; set; }
    public long Version { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
