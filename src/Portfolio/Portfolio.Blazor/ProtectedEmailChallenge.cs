using System.Security.Cryptography;
using System.Text;
using Konscious.Security.Cryptography;
using Portfolio.Blazor.Core;

namespace Portfolio.Blazor;

internal static class ProtectedEmailChallenge
{
    private const string Password = "portfolio-contact-challenge-v1";
    private const int MemoryKib = 19_456;
    private const int Iterations = 2;

    public static PublicProtectedEmailChallenge? Create(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return null;

        var salt = RandomNumberGenerator.GetBytes(16);
        var iv = RandomNumberGenerator.GetBytes(12);
        var argon2 = new Argon2id(Encoding.UTF8.GetBytes(Password))
        {
            Salt = salt,
            MemorySize = MemoryKib,
            Iterations = Iterations,
            DegreeOfParallelism = 1,
        };
        var key = argon2.GetBytes(32);
        var plaintext = Encoding.UTF8.GetBytes(email);
        var encrypted = new byte[plaintext.Length];
        var tag = new byte[16];
        using (var aes = new AesGcm(key, tag.Length))
            aes.Encrypt(iv, plaintext, encrypted, tag);

        return new PublicProtectedEmailChallenge(
            1,
            "argon2id-aes256gcm",
            Encode(salt),
            Encode(iv),
            Encode([.. encrypted, .. tag]),
            new PublicProtectedEmailParameters(MemoryKib, Iterations, 1, 32)
        );
    }

    private static string Encode(byte[] bytes) =>
        Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}
