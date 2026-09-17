using Blog.Blazor.Core;
using Microsoft.AspNetCore.Http;

namespace Blog.Blazor;

public sealed class HttpContextNotFoundResponder(IHttpContextAccessor httpContextAccessor)
    : INotFoundResponder
{
    public void MarkNotFound()
    {
        if (httpContextAccessor.HttpContext is { Response.HasStarted: false } context)
            context.Response.StatusCode = StatusCodes.Status404NotFound;
    }
}
