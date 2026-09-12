namespace Blog.Blazor.Data.Entities;

public sealed class NavItemTranslation
{
    public int Id { get; set; }
    public int NavItemId { get; set; }
    public string Locale { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public NavItem? NavItem { get; set; }
}
