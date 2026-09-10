using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;

namespace Portfolio.Blazor.Auth;

public static class AdminAuthEndpoints
{
    public const string SchemeName = "AdminCookie";

    public static void Map(WebApplication app)
    {
        // IMPORTANT: these cannot live at exactly "/admin/login" — AdminLogin.razor's own
        // `@page "/admin/login"` already registers a GET+POST-matching endpoint at that path
        // (Razor component endpoints aren't verb-restricted), so a POST mapped to the same
        // path throws AmbiguousMatchException at request time. Confirmed live, not theoretical.
        app.MapPost("/admin/sign-in", HandleLoginAsync);
        app.MapPost("/admin/sign-out", HandleLogoutAsync);
    }

    private static async Task<IResult> HandleLoginAsync(
        HttpContext context,
        IAntiforgery antiforgery,
        IAuthenticationSchemeProvider schemeProvider
    )
    {
        if (!await TryValidateAntiforgeryAsync(context, antiforgery))
            return Results.BadRequest();

        if (await schemeProvider.GetSchemeAsync(GoogleDefaults.AuthenticationScheme) is null)
            return Results.LocalRedirect("/admin/login?error=1");

        var form = await context.Request.ReadFormAsync();
        var returnUrl = form["returnUrl"].ToString();
        var target = IsLocalAdminPath(returnUrl) ? returnUrl! : "/admin";

        return Results.Challenge(
            new AuthenticationProperties { RedirectUri = target },
            [GoogleDefaults.AuthenticationScheme]
        );
    }

    private static async Task<IResult> HandleLogoutAsync(
        HttpContext context,
        IAntiforgery antiforgery
    )
    {
        if (!await TryValidateAntiforgeryAsync(context, antiforgery))
            return Results.BadRequest();

        await context.SignOutAsync(SchemeName);
        return Results.LocalRedirect("/admin/login");
    }

    private static async Task<bool> TryValidateAntiforgeryAsync(
        HttpContext context,
        IAntiforgery antiforgery
    )
    {
        try
        {
            await antiforgery.ValidateRequestAsync(context);
            return true;
        }
        catch (AntiforgeryValidationException)
        {
            return false;
        }
    }

    public static bool IsAnonymousAdminPath(PathString path) =>
        path.Equals("/admin/login", StringComparison.OrdinalIgnoreCase)
        || path.Equals("/admin/sign-in", StringComparison.OrdinalIgnoreCase)
        || path.Equals("/admin/sign-out", StringComparison.OrdinalIgnoreCase);

    private static bool IsLocalAdminPath(string? returnUrl) =>
        !string.IsNullOrWhiteSpace(returnUrl)
        && returnUrl.StartsWith("/admin", StringComparison.Ordinal)
        && !returnUrl.StartsWith("//", StringComparison.Ordinal)
        && Uri.TryCreate(returnUrl, UriKind.Relative, out _);
}
