using System.Globalization;
using System.Net;
using System.Text;

namespace Portfolio.Blazor.Core;

public sealed record TextCodecResult(bool IsValid, string Output, string? Error);

public static class TextCodecs
{
    public static TextCodecResult Transform(string codec, string? input, string operation)
    {
        if (string.IsNullOrEmpty(input))
            return new(true, string.Empty, null);
        try
        {
            var output = (codec, operation) switch
            {
                ("base64-encoder", "encode") => System.Convert.ToBase64String(
                    Encoding.UTF8.GetBytes(input)
                ),
                ("base64-encoder", "decode") => DecodeBase64(input),
                ("hex-text-codec", "encode") => string.Join(
                    ' ',
                    Encoding
                        .UTF8.GetBytes(input)
                        .Select(b => b.ToString("x2", CultureInfo.InvariantCulture))
                ),
                ("hex-text-codec", "decode") => DecodeHex(input),
                ("binary-text-codec", "encode") => string.Join(
                    ' ',
                    Encoding
                        .UTF8.GetBytes(input)
                        .Select(b => Convert.ToString(b, 2).PadLeft(8, '0'))
                ),
                ("binary-text-codec", "decode") => DecodeBinary(input),
                ("url-encoder", "encode") => Uri.EscapeDataString(input),
                ("url-encoder", "decode") => Uri.UnescapeDataString(input),
                ("html-entity-codec", "encode") => WebUtility
                    .HtmlEncode(input)
                    .Replace("'", "&#39;"),
                ("html-entity-codec", "decode") => WebUtility.HtmlDecode(input),
                _ => throw new FormatException("unsupported_operation"),
            };
            return new(true, output, null);
        }
        catch (Exception exception)
            when (exception is FormatException or DecoderFallbackException or UriFormatException)
        {
            return new(false, string.Empty, "invalid_input");
        }
    }

    private static string DecodeBase64(string input) =>
        new UTF8Encoding(false, true).GetString(System.Convert.FromBase64String(input));

    private static string DecodeHex(string input)
    {
        var cleaned = string.Concat(input.Where(c => !char.IsWhiteSpace(c)));
        if (cleaned.Length == 0 || cleaned.Length % 2 != 0 || cleaned.Any(c => !Uri.IsHexDigit(c)))
            throw new FormatException();
        var bytes = Enumerable
            .Range(0, cleaned.Length / 2)
            .Select(i => System.Convert.ToByte(cleaned.Substring(i * 2, 2), 16))
            .ToArray();
        return new UTF8Encoding(false, true).GetString(bytes);
    }

    private static string DecodeBinary(string input)
    {
        var tokens = input.Trim().Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries);
        if (
            tokens.Length == 0
            || tokens.Any(token =>
                token.Length is < 1 or > 8 || token.Any(c => c is not ('0' or '1'))
            )
        )
            throw new FormatException();
        var bytes = tokens.Select(token => Convert.ToByte(token, 2)).ToArray();
        return new UTF8Encoding(false, true).GetString(bytes);
    }
}
