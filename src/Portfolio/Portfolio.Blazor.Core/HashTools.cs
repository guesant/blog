using System.Security.Cryptography;
using System.Text;

namespace Portfolio.Blazor.Core;

public sealed record HashResult(string Sha1, string Sha256, string Sha384, string Sha512);

public static class HashTools
{
    public static HashResult Calculate(string? input)
    {
        if (string.IsNullOrEmpty(input))
            return new("", "", "", "");
        var bytes = Encoding.UTF8.GetBytes(input ?? "");
        return new(
            Hex(SHA1.HashData(bytes)),
            Hex(SHA256.HashData(bytes)),
            Hex(SHA384.HashData(bytes)),
            Hex(SHA512.HashData(bytes))
        );
    }

    private static string Hex(byte[] bytes) => Convert.ToHexString(bytes).ToLowerInvariant();
}
