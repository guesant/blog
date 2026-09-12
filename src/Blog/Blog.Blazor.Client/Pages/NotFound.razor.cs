namespace Blog.Blazor.Client.Pages;

public partial class NotFound
{
    private string Title => L["not_found_title"];
    private string HomeUrl => Urls.ForCulture("/", CurrentLocale);
}
