using System.ComponentModel.DataAnnotations;

namespace Blog.Blazor.Data.Entities;

public sealed class NavItem
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Route name is required.")]
    public string RouteName { get; set; } = string.Empty;
    public int? ParentId { get; set; }
    public string? Placement { get; set; }
    public int? SidebarGroup { get; set; }
    public int Order { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<NavItemTranslation> Translations { get; set; } = [];
}
