using System.Reflection;
using Microsoft.AspNetCore.Components.Authorization;

namespace Portfolio.Blazor.Client;

public partial class Routes
{
    // IMPORTANT: this Router's AppAssembly is always Portfolio.Blazor.Client (this project) — admin
    // pages live in Portfolio.Blazor (the server host), which Client cannot reference directly
    // without a circular project reference. Resolving it by assembly name from whatever the host
    // process already loaded — instead of a Parameter carrying an Assembly — also avoids a real bug:
    // Routes gets an explicit @rendermode on admin paths, so its Parameters must be JSON-serializable
    // for the SSR-to-interactive handoff, and System.Reflection.Assembly is not (confirmed live,
    // it throws NotSupportedException on every admin page load).
    private static readonly Assembly[] AdminHostAssembly = ResolveAdminHostAssembly();

    private static Assembly[] ResolveAdminHostAssembly()
    {
        var hostAssembly = AppDomain
            .CurrentDomain.GetAssemblies()
            .FirstOrDefault(assembly => assembly.GetName().Name == "Portfolio.Blazor");
        return hostAssembly is null ? [] : [hostAssembly];
    }
}
