using System.Security.Claims;
using Microsoft.AspNetCore.Components.Authorization;

namespace Blog.Blazor.Client;

// IMPORTANT: the WASM client never authenticates anything (admin auth is server-only,
// cookie-based, and the cookie is HttpOnly so WASM cannot read it). This provider exists
// solely so AuthorizeRouteView (shared by every route, public and admin alike) has a
// Task<AuthenticationState> to cascade — without it every WASM-rendered public page would
// throw. It always reports "anonymous", which is correct for every WASM-rendered route.
public sealed class AnonymousAuthenticationStateProvider : AuthenticationStateProvider
{
    private static readonly AuthenticationState Anonymous = new(
        new ClaimsPrincipal(new ClaimsIdentity())
    );

    public override Task<AuthenticationState> GetAuthenticationStateAsync() =>
        Task.FromResult(Anonymous);
}
