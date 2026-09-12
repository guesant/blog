using System.Text;
using System.Text.Json;

namespace Blog.Blazor.Core;

public sealed record JwtDecodeResult(bool IsValid, string Header, string Payload)
{
    public static JwtDecodeResult Empty => new(true, string.Empty, string.Empty);
    public static JwtDecodeResult Invalid => new(false, string.Empty, string.Empty);
}

public static class JwtDecoderEngine
{
    public static JwtDecodeResult Decode(string? token)
    {
        var value = token?.Trim() ?? string.Empty;
        if (value.Length == 0)
            return JwtDecodeResult.Empty;
        var segments = value.Split('.');
        if (segments.Length != 3)
            return JwtDecodeResult.Invalid;
        try
        {
            using var header = JsonDocument.Parse(DecodeSegment(segments[0]));
            using var payload = JsonDocument.Parse(DecodeSegment(segments[1]));
            var options = new JsonSerializerOptions { WriteIndented = true };
            return new(
                true,
                JsonSerializer.Serialize(header.RootElement, options),
                JsonSerializer.Serialize(payload.RootElement, options)
            );
        }
        catch (FormatException)
        {
            return JwtDecodeResult.Invalid;
        }
        catch (JsonException)
        {
            return JwtDecodeResult.Invalid;
        }
    }

    private static string DecodeSegment(string segment)
    {
        var normalized = segment.Replace('-', '+').Replace('_', '/');
        normalized = normalized.PadRight(
            normalized.Length + ((4 - normalized.Length % 4) % 4),
            '='
        );
        return Encoding.UTF8.GetString(Convert.FromBase64String(normalized));
    }
}
