using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;

namespace Portfolio.Blazor.Components.Admin;

[Authorize]
public abstract class AdminComponentBase : ComponentBase;
