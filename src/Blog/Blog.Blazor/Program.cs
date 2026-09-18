using System.Globalization;
using System.IO.Compression;
using System.Text.Json;
using System.Threading.RateLimiting;
using BlazorBlueprint.Primitives.Extensions;
using Blog.Blazor;
using Blog.Blazor.Components;
using Blog.Blazor.Core;
using Blog.Blazor.Core.Localization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.ResponseCompression;
using pax.BlazorChartJs;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddKeyPerFile("/secrets/app", optional: true);

builder
    .Services.AddRazorComponents()
    .AddInteractiveWebAssemblyComponents()
    .AddInteractiveServerComponents();
builder.Services.AddBlazorBlueprintPrimitives();
builder.Services.AddScoped<Blog.Blazor.UI.Foundations.SiteToastService>();
builder.Services.AddScoped<Blog.Blazor.UI.Foundations.SiteDialogService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<INotFoundResponder, HttpContextNotFoundResponder>();
builder.Services.AddLocalization();
builder.Services.AddSingleton<ICultureCatalog, CultureCatalog>();
builder.Services.AddSingleton<ILocalizedUrlBuilder, LocalizedUrlBuilder>();
builder.Services.AddMemoryCache();
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});
builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
    options.Level = CompressionLevel.Fastest
);
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
    options.Level = CompressionLevel.Fastest
);
builder.Services.AddSingleton<PublicSiteSnapshotPayloadCache>();
builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy(
        "snippet-download",
        context =>
            RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 12,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0,
                    AutoReplenishment = true,
                }
            )
    );
    options.AddPolicy(
        "public-api",
        context =>
            RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 60,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0,
                    AutoReplenishment = true,
                }
            )
    );
    options.AddPolicy(
        "protected-email",
        context =>
            RateLimitPartition.GetFixedWindowLimiter(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 3,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0,
                    AutoReplenishment = true,
                }
            )
    );
});

var contentApiUrl =
    builder.Configuration["PORTFOLIO_CONTENT_API_URL"] ?? "http://laravel:8000/api/v1";
builder.Services.AddHttpClient(
    "laravel-content",
    client =>
    {
        client.BaseAddress = new Uri($"{contentApiUrl.TrimEnd('/')}/");
        client.Timeout = TimeSpan.FromSeconds(15);
    }
);
builder.Services.AddSingleton<IPublicSiteContentProvider, LaravelPublicSiteContentProvider>();
builder.Services.AddSingleton<IPublicKnowledgeGraphProvider, LaravelPublicKnowledgeGraphProvider>();
builder.Services.AddSingleton<ResumePdfGenerationService>();
builder.Services.AddSingleton<IResumePdfService>(services =>
    services.GetRequiredService<ResumePdfGenerationService>()
);
builder.Services.AddHostedService(services =>
    services.GetRequiredService<ResumePdfGenerationService>()
);
builder.Services.AddChartJs(options =>
    options.ChartJsLocation = "/vendor/chartjs/chart.esm-shim.js"
);

builder.Services.AddAntiforgery(options =>
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always
);

var app = builder.Build();

// IMPORTANT: TLS terminates at the Cloudflare Tunnel; cloudflared forwards to this
// container over plain HTTP on a private compose network with no other ingress, so this
// is the only hop and trusting its X-Forwarded-* headers is safe. Without this,
// Request.Scheme is always "http" inside the container, which silently strips the
// Secure flag from every cookie (CookieSecurePolicy.SameAsRequest) even in production.
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
};
forwardedHeadersOptions.KnownIPNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);
app.UseResponseCompression();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();

    // IMPORTANT: `dotnet watch`'s own browser-refresh tooling injects an inline script
    // and opens a websocket to a random localhost port, which a strict CSP legitimately
    // blocks. That tooling never runs in the published production image (see
    // docker/entrypoint.prod.sh), so these headers are production-only rather than
    // loosened to accommodate it.
    app.Use(
        async (context, next) =>
        {
            var headers = context.Response.Headers;
            headers.Append("X-Content-Type-Options", "nosniff");
            headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
            headers.Append(
                "Permissions-Policy",
                "camera=(), microphone=(), geolocation=(), payment=()"
            );
            headers.Append(
                "Content-Security-Policy",
                "default-src 'self'; "
                    +
                    // IMPORTANT: 'unsafe-inline' here is scoped to <ImportMap /> (App.razor), the
                    // one inline <script type="importmap"> Blazor itself renders with
                    // framework-generated, per-build asset URLs -- never user- or admin-supplied
                    // content. Verified separately that no page in this app builds an inline
                    // <script> or an inline on*= handler from any request-derived value, so this
                    // does not open an XSS path; it only accommodates a framework feature that a
                    // strict script-src would otherwise break every page load on.
                    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; "
                    + "style-src 'self' 'unsafe-inline'; "
                    + "img-src 'self' data:; "
                    + "font-src 'self'; "
                    + "connect-src 'self'; "
                    + "frame-ancestors 'self'; "
                    + "base-uri 'self'; "
                    + "form-action 'self'; "
                    + "object-src 'none'"
            );
            await next();
        }
    );
}

var localizationOptions = new RequestLocalizationOptions()
    .SetDefaultCulture(CultureCatalog.DefaultCultureName)
    .AddSupportedCultures("en", "pt-BR")
    .AddSupportedUICultures("en", "pt-BR");
localizationOptions.RequestCultureProviders.Insert(
    0,
    new PathRequestCultureProvider(app.Services.GetRequiredService<ICultureCatalog>())
);
app.UseRequestLocalization(localizationOptions);

if (app.Environment.IsDevelopment())
{
    app.UseWebAssemblyDebugging();
}
else
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseAntiforgery();
app.UseRateLimiter();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

// IMPORTANT: readiness must fail while Laravel cannot serve public content, or the Service starts
// routing real traffic to a pod whose first content read throws right after every rolling deploy.
app.MapGet(
    "/health/ready",
    async (IPublicSiteContentProvider contentProvider, CancellationToken cancellationToken) =>
    {
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        timeout.CancelAfter(TimeSpan.FromSeconds(2));
        try
        {
            var snapshot = await contentProvider.GetAsync(
                CultureCatalog.DefaultCultureName,
                timeout.Token
            );
            return snapshot is null
                ? Results.StatusCode(StatusCodes.Status503ServiceUnavailable)
                : Results.Ok(new { status = "ok" });
        }
        catch (HttpRequestException)
        {
            return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
        }
        catch (JsonException)
        {
            return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
        }
        catch (OperationCanceledException)
        {
            return Results.StatusCode(StatusCodes.Status503ServiceUnavailable);
        }
    }
);

app.MapGet(
    "/Culture/Set",
    (string? culture, string? redirectUri, HttpContext context, ICultureCatalog cultures) =>
    {
        if (!cultures.IsSupported(culture))
        {
            return Results.BadRequest("Unsupported culture.");
        }

        var normalized = cultures.Normalize(culture).Name;
        context.Response.Cookies.Append(
            CookieRequestCultureProvider.DefaultCookieName,
            CookieRequestCultureProvider.MakeCookieValue(
                new RequestCulture(normalized, normalized)
            ),
            // IMPORTANT: HttpOnly must stay false — the WASM client (Program.cs) reads this cookie via
            // JS interop to sync CultureInfo before the interactive circuit boots, since ASP.NET Core's
            // cookie culture provider only runs server-side and WASM has no access to HttpOnly cookies.
            new CookieOptions
            {
                IsEssential = true,
                SameSite = SameSiteMode.Lax,
                HttpOnly = false,
                Path = "/",
            }
        );

        var target = string.IsNullOrWhiteSpace(redirectUri) ? "/" : redirectUri;
        return Results.LocalRedirect(target);
    }
);

app.MapPost(
        "/api/protected-email/challenge",
        async (IPublicSiteContentProvider contentProvider, CancellationToken cancellationToken) =>
        {
            var challenge = await contentProvider.CreateEmailChallengeAsync(cancellationToken);
            return challenge is null ? Results.NotFound() : Results.Ok(challenge);
        }
    )
    .RequireRateLimiting("protected-email");

app.MapGet(
    "/storage/resume-{locale}.pdf",
    async (
        string locale,
        IResumePdfService resumePdfService,
        CancellationToken cancellationToken
    ) =>
    {
        if (
            !CultureCatalog.NormalizeName(locale).Equals(locale, StringComparison.OrdinalIgnoreCase)
        )
        {
            return Results.NotFound();
        }

        var filePath = await resumePdfService.GetBestAvailableAsync(locale, cancellationToken);
        return filePath is not null && File.Exists(filePath)
            ? Results.File(filePath, "application/pdf", enableRangeProcessing: true)
            : Results.NotFound();
    }
);

app.MapStaticAssets();
app.MapGet(
    "/_content/public-site",
    async (
        PublicSiteSnapshotPayloadCache payloads,
        HttpContext context,
        string? locale,
        CancellationToken cancellationToken
    ) =>
    {
        var supportedLocale = CultureCatalog.NormalizeName(locale);
        var payload = await payloads.GetAsync(supportedLocale, cancellationToken);
        if (payload is null)
            return Results.NotFound();

        var headers = context.Response.GetTypedHeaders();
        headers.ETag = new Microsoft.Net.Http.Headers.EntityTagHeaderValue(payload.ETag);
        headers.CacheControl = new Microsoft.Net.Http.Headers.CacheControlHeaderValue
        {
            NoCache = true,
            Public = true,
        };
        context.Response.Headers.Vary = "Accept-Encoding";
        if (
            context.Request.GetTypedHeaders().IfNoneMatch is { Count: > 0 } candidates
            && candidates.Any(candidate =>
                candidate.Compare(headers.ETag, useStrongComparison: false)
            )
        )
        {
            return Results.StatusCode(StatusCodes.Status304NotModified);
        }

        return Results.Bytes(payload.Body, "application/json; charset=utf-8");
    }
);
app.MapGet(
    "/_content/public-knowledge-map",
    async (
        IPublicKnowledgeGraphProvider graphProvider,
        string? locale,
        CancellationToken cancellationToken
    ) =>
    {
        var supportedLocale = CultureCatalog.NormalizeName(locale);
        var graph = await graphProvider.GetAsync(supportedLocale, cancellationToken);
        return graph is null ? Results.NotFound() : Results.Ok(graph);
    }
);
app.MapGet(
    "/knowledge-map/data",
    async (IPublicKnowledgeGraphProvider graphProvider, CancellationToken cancellationToken) =>
    {
        var graph = await graphProvider.GetAsync(
            CultureCatalog.DefaultCultureName,
            cancellationToken
        );
        return graph is null ? Results.NotFound() : Results.Ok(graph);
    }
);
app.MapGet(
    "/pt-BR/knowledge-map/data",
    async (IPublicKnowledgeGraphProvider graphProvider, CancellationToken cancellationToken) =>
    {
        var graph = await graphProvider.GetAsync("pt-BR", cancellationToken);
        return graph is null ? Results.NotFound() : Results.Ok(graph);
    }
);
app.MapGet(
        "/snippets/{slug}/download",
        (
            string slug,
            HttpRequest request,
            IPublicSiteContentProvider contentProvider,
            CancellationToken cancellationToken
        ) =>
            DownloadSnippet(
                "en",
                slug,
                request
                    .Query["files"]
                    .Where(id => !string.IsNullOrWhiteSpace(id))
                    .Select(id => id!)
                    .ToArray(),
                contentProvider,
                cancellationToken
            )
    )
    .RequireRateLimiting("snippet-download");
app.MapGet(
        "/pt-BR/snippets/{slug}/download",
        (
            string slug,
            HttpRequest request,
            IPublicSiteContentProvider contentProvider,
            CancellationToken cancellationToken
        ) =>
            DownloadSnippet(
                "pt-BR",
                slug,
                request
                    .Query["files"]
                    .Where(id => !string.IsNullOrWhiteSpace(id))
                    .Select(id => id!)
                    .ToArray(),
                contentProvider,
                cancellationToken
            )
    )
    .RequireRateLimiting("snippet-download");
app.MapGet(
        "/api/v1/findings",
        (
            HttpRequest request,
            IPublicSiteContentProvider provider,
            CancellationToken cancellationToken
        ) => FindFindingApi(request, provider, cancellationToken)
    )
    .RequireRateLimiting("public-api");
app.MapGet(
        "/api/v1/findings/{slug}",
        (
            string slug,
            HttpRequest request,
            IPublicSiteContentProvider provider,
            CancellationToken cancellationToken
        ) => FindFindingApiItem(slug, request, provider, cancellationToken)
    )
    .RequireRateLimiting("public-api");
PublicMetadataEndpoints.Map(app);
MapLegacyRoutes(app);
app.MapRazorComponents<App>()
    .AddInteractiveWebAssemblyRenderMode()
    .AddInteractiveServerRenderMode()
    .AddAdditionalAssemblies(typeof(Blog.Blazor.Client._Imports).Assembly);

static async Task<IResult> DownloadSnippet(
    string locale,
    string slug,
    IReadOnlyList<string> selectedFileIds,
    IPublicSiteContentProvider contentProvider,
    CancellationToken cancellationToken
)
{
    var snapshot = await contentProvider.GetAsync(locale, cancellationToken);
    var snippet = snapshot?.Snippets.FirstOrDefault(item =>
        item.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase)
    );

    if (snippet is null)
    {
        return Results.NotFound();
    }

    try
    {
        var archive = SnippetArchiveBuilder.Build(snippet, selectedFileIds);
        return Results.File(archive, "application/zip", $"{snippet.Slug}.zip");
    }
    catch (SnippetArchiveException)
    {
        return Results.Problem(
            title: "Snippet download unavailable",
            detail: "The public snippet files do not satisfy the archive safety limits.",
            statusCode: StatusCodes.Status422UnprocessableEntity
        );
    }
}

static async Task<IResult> FindFindingApi(
    HttpRequest request,
    IPublicSiteContentProvider provider,
    CancellationToken cancellationToken
)
{
    var locale = CultureCatalog.NormalizeName(request.Query["locale"].ToString());
    var snapshot = await provider.GetAsync(locale, cancellationToken);
    var query = request.Query["q"].ToString();
    var type = request.Query["type"].ToString();
    var topic = request.Query["topic"].ToString();
    var rating = request.Query["rating"].ToString();
    var state = request.Query["consumption_state"].ToString();
    var year = request.Query["year"].ToString();
    var freeOnly =
        string.Equals(
            request.Query["free_only"].ToString(),
            "true",
            StringComparison.OrdinalIgnoreCase
        )
        || request.Query["free_only"] == "1";
    var filtered = (snapshot?.Findings ?? [])
        .Where(item =>
            (
                string.IsNullOrWhiteSpace(query)
                || string.Join(
                        ' ',
                        item.Title,
                        item.AlternativeTitle,
                        item.Description,
                        item.Authors
                    )
                    .Contains(query, StringComparison.OrdinalIgnoreCase)
            )
            && (
                string.IsNullOrWhiteSpace(type)
                || string.Equals(item.Type, type, StringComparison.OrdinalIgnoreCase)
            )
            && (
                string.IsNullOrWhiteSpace(topic)
                || item.Topics?.Any(value =>
                    string.Equals(value.Slug, topic, StringComparison.OrdinalIgnoreCase)
                ) == true
            )
            && (
                string.IsNullOrWhiteSpace(rating)
                || string.Equals(item.Rating, rating, StringComparison.OrdinalIgnoreCase)
            )
            && (
                string.IsNullOrWhiteSpace(state)
                || string.Equals(item.ConsumptionState, state, StringComparison.OrdinalIgnoreCase)
            )
            && (
                string.IsNullOrWhiteSpace(year)
                || item.PublishedDate?.StartsWith(year, StringComparison.OrdinalIgnoreCase) == true
            )
            && (!freeOnly || item.Links?.Any(value => value.IsFree) == true)
        )
        .ToArray();
    var page = Math.Max(1, ParseInt(request.Query["page"].ToString(), 1));
    var perPage = Math.Clamp(ParseInt(request.Query["per_page"].ToString(), 20), 1, 100);
    var data = filtered.Skip((page - 1) * perPage).Take(perPage);
    return Results.Json(
        new
        {
            data,
            meta = new
            {
                page,
                per_page = perPage,
                total = filtered.Length,
                locale,
            },
        }
    );
}

static async Task<IResult> FindFindingApiItem(
    string slug,
    HttpRequest request,
    IPublicSiteContentProvider provider,
    CancellationToken cancellationToken
)
{
    var locale = CultureCatalog.NormalizeName(request.Query["locale"].ToString());
    var snapshot = await provider.GetAsync(locale, cancellationToken);
    var finding = snapshot?.Findings.FirstOrDefault(item =>
        item.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase)
    );
    return finding is null
        ? Results.Json(new { error = "not_found" }, statusCode: StatusCodes.Status404NotFound)
        : Results.Json(finding);
}

static int ParseInt(string value, int fallback) =>
    int.TryParse(value, out var result) ? result : fallback;

static void MapLegacyRoutes(WebApplication app)
{
    MapRedirect(app, "/projetos", "/projects");
    MapRedirect(app, "/projetos/experimentos/{slug}", "/projects/experiments/{slug}");
    MapRedirect(app, "/projetos/{slug}", "/projects/{slug}");
    MapRedirect(app, "/escritos", "/writing");
    MapRedirect(app, "/escritos/{slug}", "/writing/{slug}");
    MapRedirect(app, "/sobre", "/about");
    MapRedirect(app, "/contato", "/contact");
    MapRedirect(app, "/curriculo", "/resume");
    MapRedirect(app, "/achados", "/findings");
    MapRedirect(app, "/achados/tipos/{type}", "/findings");
    MapRedirect(app, "/achados/{slug}", "/findings/{slug}");
    MapRedirect(app, "/topicos", "/topics");
    MapRedirect(app, "/topicos/{slug}", "/topics/{slug}");
    MapRedirect(app, "/agora", "/now");
    MapRedirect(app, "/pt-BR/agora", "/pt-BR/now");
    MapRedirect(app, "/colecoes", "/collections");
    MapRedirect(app, "/colecoes/{slug}", "/collections/{slug}");
    MapRedirect(app, "/pt-BR/colecoes", "/pt-BR/collections");
    MapRedirect(app, "/pt-BR/colecoes/{slug}", "/pt-BR/collections/{slug}");
}

static void MapRedirect(WebApplication app, string source, string target) =>
    app.MapGet(
        source,
        (HttpContext context) =>
        {
            var location = target
                .Replace(
                    "{slug}",
                    Uri.EscapeDataString(
                        context.Request.RouteValues["slug"]?.ToString() ?? string.Empty
                    ),
                    StringComparison.Ordinal
                )
                .Replace(
                    "{type}",
                    Uri.EscapeDataString(
                        context.Request.RouteValues["type"]?.ToString() ?? string.Empty
                    ),
                    StringComparison.Ordinal
                );
            return Results.Redirect(location, permanent: true);
        }
    );

app.Run();
return 0;
