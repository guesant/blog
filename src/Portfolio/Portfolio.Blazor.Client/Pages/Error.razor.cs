namespace Portfolio.Blazor.Client.Pages;

public partial class Error
{
    private string Title => L["error_title"];
    private string HomeUrl => Urls.ForCulture("/", CurrentLocale);
}
