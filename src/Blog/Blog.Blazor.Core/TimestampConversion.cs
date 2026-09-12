using System.Globalization;

namespace Blog.Blazor.Core;

public sealed record TimestampResult(
    bool IsValid,
    string Utc,
    string Local,
    string TimestampFromDate,
    string? Error
);

public static class TimestampConversion
{
    public static TimestampResult FromTimestamp(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return new(true, "", "", "", null);
        if (
            !long.TryParse(
                raw.Trim(),
                NumberStyles.Integer,
                CultureInfo.InvariantCulture,
                out var value
            )
        )
            return Invalid();
        try
        {
            var date =
                Math.Abs(value) >= 1_000_000_000_000L
                    ? DateTimeOffset.FromUnixTimeMilliseconds(value)
                    : DateTimeOffset.FromUnixTimeSeconds(value);
            return new(
                true,
                date.UtcDateTime.ToString(
                    "yyyy-MM-dd HH:mm:ss 'UTC'",
                    CultureInfo.InvariantCulture
                ),
                date.ToLocalTime()
                    .ToString("yyyy-MM-dd HH:mm:ss zzz", CultureInfo.InvariantCulture),
                "",
                null
            );
        }
        catch (ArgumentOutOfRangeException)
        {
            return Invalid();
        }
    }

    public static TimestampResult FromDate(DateTime date)
    {
        var timestamp = new DateTimeOffset(DateTime.SpecifyKind(date, DateTimeKind.Local))
            .ToUnixTimeSeconds()
            .ToString(CultureInfo.InvariantCulture);
        return new(true, "", "", timestamp, null);
    }

    private static TimestampResult Invalid() => new(false, "", "", "", "invalid_timestamp");
}
