using System.Globalization;

namespace Blog.Blazor.Core.Localization;

// IMPORTANT: IStringLocalizer resolves strings from the thread's ambient
// CultureInfo.CurrentUICulture, not from an explicit parameter; there is no
// supported way to ask it for a specific culture's string directly (the old
// IStringLocalizer.WithCulture was removed from ASP.NET Core). Code that
// needs a specific locale's string outside of a request pipeline that already
// set the ambient culture (a background service, a cache rebuild keyed by
// locale) must swap the ambient culture for the duration of the lookup and
// restore it afterward, which is what this type does.
public readonly struct CultureScope : IDisposable
{
    private readonly CultureInfo _previousCulture;
    private readonly CultureInfo _previousUiCulture;

    private CultureScope(CultureInfo previousCulture, CultureInfo previousUiCulture)
    {
        _previousCulture = previousCulture;
        _previousUiCulture = previousUiCulture;
    }

    public static CultureScope Enter(string cultureName)
    {
        var previousCulture = CultureInfo.CurrentCulture;
        var previousUiCulture = CultureInfo.CurrentUICulture;
        var culture = CultureInfo.GetCultureInfo(cultureName);
        CultureInfo.CurrentCulture = culture;
        CultureInfo.CurrentUICulture = culture;
        return new CultureScope(previousCulture, previousUiCulture);
    }

    public void Dispose()
    {
        CultureInfo.CurrentCulture = _previousCulture;
        CultureInfo.CurrentUICulture = _previousUiCulture;
    }
}
