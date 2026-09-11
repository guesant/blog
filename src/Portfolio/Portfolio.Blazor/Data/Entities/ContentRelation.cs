namespace Portfolio.Blazor.Data.Entities;

public sealed class ContentRelation
{
    public int Id { get; set; }
    public int RelationTypeId { get; set; }
    public string SubjectType { get; set; } = string.Empty;
    public int SubjectId { get; set; }
    public string ObjectType { get; set; } = string.Empty;
    public int ObjectId { get; set; }
    public string? Note { get; set; }
    public string? Context { get; set; }
    public string? Status { get; set; }
    public string? Visibility { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public RelationType? RelationType { get; set; }
}
