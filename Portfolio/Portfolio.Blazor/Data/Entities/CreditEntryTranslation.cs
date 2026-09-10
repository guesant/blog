namespace Portfolio.Blazor.Data.Entities;

public sealed class CreditEntryTranslation
{
    public int Id { get; set; }
    public int CreditEntryId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public CreditEntry? CreditEntry { get; set; }
}
