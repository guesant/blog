using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;

namespace Blog.Blazor.Components.Admin;

[Authorize]
public abstract class AdminComponentBase : ComponentBase;
