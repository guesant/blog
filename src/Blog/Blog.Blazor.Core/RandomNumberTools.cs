using System.Globalization;
using System.Security.Cryptography;
using System.Text;

namespace Blog.Blazor.Core;

public sealed record RandomNumberResult(IReadOnlyList<string> Values, string? Note, string? Error);

public static class RandomNumberTools
{
    private static readonly string[] FirstNames =
    [
        "James",
        "Mary",
        "John",
        "Patricia",
        "Robert",
        "Jennifer",
        "Michael",
        "Linda",
        "William",
        "Elizabeth",
        "David",
        "Barbara",
        "Richard",
        "Susan",
        "Joseph",
        "Jessica",
        "Thomas",
        "Sarah",
        "Charles",
        "Karen",
        "Emma",
        "Olivia",
        "Noah",
        "Liam",
        "Sophia",
        "Lucas",
        "Mia",
        "Ethan",
        "Amelia",
        "Henry",
        "Joao",
        "Maria",
        "Jose",
        "Ana",
        "Pedro",
        "Francisca",
        "Antonio",
        "Adriana",
        "Carlos",
        "Juliana",
        "Paulo",
        "Camila",
        "Fernanda",
        "Marcos",
        "Beatriz",
        "Rafael",
        "Larissa",
        "Gabriel",
        "Leticia",
        "Bruno",
        "Felipe",
        "Aline",
        "Rodrigo",
        "Vanessa",
        "Thiago",
        "Renata",
        "Diego",
        "Amanda",
    ];
    private static readonly string[] LastNames =
    [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Hernandez",
        "Lopez",
        "Gonzalez",
        "Wilson",
        "Anderson",
        "Thomas",
        "Taylor",
        "Moore",
        "Jackson",
        "Martin",
        "Silva",
        "Santos",
        "Oliveira",
        "Souza",
        "Rodrigues",
        "Ferreira",
        "Alves",
        "Pereira",
        "Lima",
        "Gomes",
        "Costa",
        "Ribeiro",
        "Carvalho",
        "Almeida",
        "Lopes",
        "Soares",
        "Fernandes",
        "Vieira",
        "Barbosa",
        "Rocha",
        "Dias",
        "Nascimento",
        "Moreira",
        "Cardoso",
        "Teixeira",
        "Correia",
        "Cavalcanti",
        "Melo",
        "Araujo",
        "Castro",
    ];

    public static FakeNameResult GenerateNames(int count, bool includeUsername, bool includeEmail)
    {
        count = Math.Clamp(count, 1, 50);
        var values = Enumerable
            .Range(0, count)
            .Select(_ =>
            {
                var first = FirstNames[RandomNumberGenerator.GetInt32(FirstNames.Length)];
                var last = LastNames[RandomNumberGenerator.GetInt32(LastNames.Length)];
                var slug = $"{Slug(first)}.{Slug(last)}";
                var parts = new List<string> { $"{first} {last}" };
                if (includeUsername)
                    parts.Add($"{slug}{RandomNumberGenerator.GetInt32(10, 100)}");
                if (includeEmail)
                    parts.Add($"{slug}{RandomNumberGenerator.GetInt32(10, 100)}@example.com");
                return string.Join(" - ", parts);
            })
            .ToArray();
        return new(values);
    }

    private static string Slug(string value) =>
        string.Concat(
                value
                    .Normalize(NormalizationForm.FormD)
                    .Where(c =>
                        CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark
                    )
            )
            .ToLowerInvariant();

    private const string Lowercase = "abcdefghijklmnopqrstuvwxyz";
    private const string Uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string Numbers = "0123456789";
    private const string Symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    public static RandomStringResult GenerateStrings(
        int length,
        int count,
        bool lowercase,
        bool uppercase,
        bool numbers,
        bool symbols
    )
    {
        length = Math.Clamp(length, 1, 64);
        count = Math.Clamp(count, 1, 50);
        var alphabet = string.Concat(
            lowercase ? Lowercase : "",
            uppercase ? Uppercase : "",
            numbers ? Numbers : "",
            symbols ? Symbols : ""
        );
        if (alphabet.Length == 0)
            return new([], "no_charset");
        var values = Enumerable
            .Range(0, count)
            .Select(_ =>
                string.Concat(
                    Enumerable
                        .Range(0, length)
                        .Select(__ => alphabet[RandomNumberGenerator.GetInt32(alphabet.Length)])
                )
            )
            .ToArray();
        return new(values, null);
    }

    public static RandomDateResult GenerateDates(
        DateTime from,
        DateTime to,
        int count,
        bool includeTime
    )
    {
        count = Math.Clamp(count, 1, 50);
        var start = from <= to ? from : to;
        var end = from <= to ? to : from;
        if (end < start)
            return new([], "invalid_range");
        var startTicks = start.Ticks;
        var range = end.Ticks - startTicks;
        var values = Enumerable
            .Range(0, count)
            .Select(_ =>
            {
                var offset =
                    range == 0 ? 0 : (long)(RandomUInt64() / (double)ulong.MaxValue * range);
                var date = new DateTime(startTicks + offset, DateTimeKind.Utc);
                return includeTime
                    ? date.ToString(
                        "yyyy-MM-dd HH:mm:ss",
                        System.Globalization.CultureInfo.InvariantCulture
                    )
                    : date.ToString(
                        "yyyy-MM-dd",
                        System.Globalization.CultureInfo.InvariantCulture
                    );
            })
            .ToArray();
        return new(values, null);
    }

    public static ColorPaletteResult GenerateColorPalette(int count)
    {
        count = Math.Clamp(count, 3, 10);
        var colors = Enumerable
            .Range(0, count)
            .Select(_ =>
            {
                var hue = RandomUInt64() / (double)ulong.MaxValue * 360d;
                var saturation = 55d + RandomUInt64() / (double)ulong.MaxValue * 25d;
                var lightness = 45d + RandomUInt64() / (double)ulong.MaxValue * 20d;
                return HslToHex(hue, saturation, lightness);
            })
            .ToArray();
        return new(colors);
    }

    public static PasswordResult GeneratePassword(
        int length,
        bool uppercase,
        bool lowercase,
        bool numbers,
        bool symbols
    )
    {
        length = Math.Clamp(length, 8, 64);
        var alphabet = string.Concat(
            uppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
            lowercase ? Lowercase : "",
            numbers ? Numbers : "",
            symbols ? Symbols : ""
        );
        if (alphabet.Length == 0)
            return new(string.Empty, 0, 0);
        var password = string.Concat(
            Enumerable
                .Range(0, length)
                .Select(_ => alphabet[RandomNumberGenerator.GetInt32(alphabet.Length)])
        );
        var bits = (int)Math.Round(length * Math.Log2(alphabet.Length));
        return new(password, bits, (int)Math.Min(100, Math.Round(bits / 128d * 100)));
    }

    public static IReadOnlyList<string> GenerateUuids(int count) =>
        Enumerable
            .Range(0, Math.Clamp(count, 1, 50))
            .Select(_ => Guid.NewGuid().ToString("D"))
            .ToArray();

    private static string HslToHex(double hue, double saturation, double lightness)
    {
        var s = saturation / 100;
        var l = lightness / 100;
        var c = (1 - Math.Abs(2 * l - 1)) * s;
        var x = c * (1 - Math.Abs(hue / 60 % 2 - 1));
        var m = l - c / 2;
        var (r, g, b) = hue switch
        {
            < 60 => (c, x, 0d),
            < 120 => (x, c, 0d),
            < 180 => (0d, c, x),
            < 240 => (0d, x, c),
            < 300 => (x, 0d, c),
            _ => (c, 0d, x),
        };
        return $"#{Channel(r + m)}{Channel(g + m)}{Channel(b + m)}";
    }

    private static string Channel(double value) =>
        Math.Clamp((int)Math.Round(value * 255), 0, 255)
            .ToString("x2", CultureInfo.InvariantCulture);

    public static RandomNumberResult GenerateNumbers(
        double min,
        double max,
        int count,
        string mode,
        bool noDuplicates
    )
    {
        if (
            double.IsNaN(min)
            || double.IsNaN(max)
            || double.IsInfinity(min)
            || double.IsInfinity(max)
        )
            return new([], null, "invalid_range");
        if (min > max)
            (min, max) = (max, min);
        count = Math.Clamp(count, 1, 50);
        if (mode == "decimal")
            return new(
                Enumerable
                    .Range(0, count)
                    .Select(_ =>
                        RandomDecimal(min, max)
                            .ToString("0.####", System.Globalization.CultureInfo.InvariantCulture)
                    )
                    .ToArray(),
                null,
                null
            );
        var low = (long)Math.Ceiling(min);
        var high = (long)Math.Floor(max);
        if (low > high)
            return new([], null, "empty_integer_range");
        var values = noDuplicates
            ? UniqueIntegers(low, high, count)
            : Enumerable.Range(0, count).Select(_ => RandomInt64(low, high)).ToArray();
        var note =
            values.Count < count ? $"only {values.Count} unique values fit in this range" : null;
        return new(
            values
                .Select(v => v.ToString(System.Globalization.CultureInfo.InvariantCulture))
                .ToArray(),
            note,
            null
        );
    }

    private static double RandomDecimal(double min, double max) =>
        Math.Round(
            min + RandomNumberGenerator.GetInt32(int.MaxValue) / (double)int.MaxValue * (max - min),
            4
        );

    private static long RandomInt64(long min, long max)
    {
        var span = (double)max - min + 1d;
        if (span >= ulong.MaxValue)
            return (long)RandomUInt64();
        return min + (long)(RandomUInt64() % (ulong)span);
    }

    private static ulong RandomUInt64()
    {
        Span<byte> bytes = stackalloc byte[8];
        RandomNumberGenerator.Fill(bytes);
        return BitConverter.ToUInt64(bytes);
    }

    private static IReadOnlyList<long> UniqueIntegers(long min, long max, int count)
    {
        var size = max - min + 1d;
        var target = (int)Math.Min(count, size);
        var values = new HashSet<long>();
        var attempts = 0;
        while (values.Count < target && attempts++ < target * 50)
            values.Add(RandomInt64(min, max));
        return values.ToArray();
    }
}

public sealed record RandomStringResult(IReadOnlyList<string> Values, string? Error);

public sealed record RandomDateResult(IReadOnlyList<string> Values, string? Error);

public sealed record FakeNameResult(IReadOnlyList<string> Values);

public sealed record ColorPaletteResult(IReadOnlyList<string> Values);

public sealed record PasswordResult(string Value, int StrengthBits, int StrengthPercent);
