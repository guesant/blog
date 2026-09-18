using Blog.Blazor.Data;
using Microsoft.EntityFrameworkCore;

namespace Blog.Blazor.Popularity;

public static class ContentRevisionWriter
{
    public static Task SignalContentChangedAsync(BlogAdminDbContext dbContext) =>
        dbContext.Database.ExecuteSqlRawAsync(
            "insert into content_revisions (id, version, updated_at) values (1, 1, now()) on conflict (id) do update set version = content_revisions.version + 1, updated_at = now()"
        );
}
