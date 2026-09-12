namespace Blog.Blazor.Data.Entities;

public sealed class RelationType
{
    public int Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Family { get; set; } = string.Empty;
    public bool Symmetric { get; set; }
    public string OutboundLabelEn { get; set; } = string.Empty;
    public string OutboundLabelPtBr { get; set; } = string.Empty;
    public string InboundLabelEn { get; set; } = string.Empty;
    public string InboundLabelPtBr { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<ContentRelation> Relations { get; set; } = [];
}
