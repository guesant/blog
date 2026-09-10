namespace Portfolio.Blazor.Client.Shared;

public partial class RedirectToAdminLogin
{
    protected override void OnInitialized() =>
        Navigation.NavigateTo(
            $"/admin/login?returnUrl={Uri.EscapeDataString(Navigation.Uri)}",
            forceLoad: true
        );
}
