namespace Portfolio.Blazor.Data.Entities;

public sealed class ReferenceCollectionItem
{
    public int ReferenceCollectionId { get; set; }
    public int ResourceId { get; set; }
    public string? Note { get; set; }
    public int? Order { get; set; }

    public ReferenceCollection? ReferenceCollection { get; set; }
    public Resource? Resource { get; set; }
}
