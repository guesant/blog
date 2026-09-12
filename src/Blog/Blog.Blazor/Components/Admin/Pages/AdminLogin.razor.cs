using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Pages;

public partial class AdminLogin
{
    [SupplyParameterFromQuery]
    public string? ReturnUrl { get; set; }

    [SupplyParameterFromQuery(Name = "error")]
    public string? Error { get; set; }

    private bool HasError => !string.IsNullOrEmpty(Error);
}
