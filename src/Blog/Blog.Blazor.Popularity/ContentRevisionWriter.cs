using Blog.Blazor.Data;
using Microsoft.EntityFrameworkCore;

namespace Blog.Blazor.Popularity;

// IMPORTANT: this mirrors ContentRevisionTracker.SignalContentChangedAsync exactly. That class
// takes an IDbContextFactory<BlogPublicDbContext>, which is wired through the web app's DI
// container; standing one up here for a single statement would add more machinery than the raw
// SQL it wraps. Keep this in sync with Data/ContentRevisionTracker.cs if that upsert ever changes.
public static class ContentRevisionWriter
{
    public static Task SignalContentChangedAsync(BlogAdminDbContext dbContext) =>
        dbContext.Database.ExecuteSqlRawAsync(
            "insert into content_revisions (id, version, updated_at) values (1, 1, now()) on conflict (id) do update set version = content_revisions.version + 1, updated_at = now()"
        );
}
