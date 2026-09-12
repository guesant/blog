using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Blog.Blazor.Core;

public readonly record struct TextToolRow(string Label, int Count);

public readonly record struct ExtendedTextToolResult(
    bool IsValid,
    string Output,
    IReadOnlyList<TextToolRow> Rows,
    int Count,
    string? Error = null
);

public static partial class ExtendedTextTools
{
    public const int MaximumInputCharacters = 200_000;
    public const int MaximumGeneratedParagraphs = 20;
    public const int WordsPerMinute = 200;

    private static readonly string[] LoremSentences =
    [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Integer feugiat, sapien at porttitor tincidunt, justo erat consequat nibh, vitae posuere massa sem a arcu.",
        "Suspendisse potenti. Donec finibus, nibh sed fermentum consequat, justo lectus tincidunt nisl, a volutpat eros lacus vel erat.",
        "Praesent commodo, mi non blandit lacinia, urna sem faucibus neque, sed consequat massa mauris vitae justo.",
        "Curabitur viverra, augue at tincidunt malesuada, neque sem luctus neque, vel facilisis nisl erat a justo.",
    ];

    private static readonly Dictionary<char, char> LeetMap = new()
    {
        ['a'] = '4',
        ['e'] = '3',
        ['i'] = '1',
        ['o'] = '0',
        ['s'] = '5',
        ['t'] = '7',
        ['A'] = '4',
        ['E'] = '3',
        ['I'] = '1',
        ['O'] = '0',
        ['S'] = '5',
        ['T'] = '7',
    };

    public static ExtendedTextToolResult Analyze(
        string? slug,
        string? input,
        int number = 3,
        string? mode = null
    )
    {
        var text = input ?? string.Empty;
        if (text.Length > MaximumInputCharacters)
        {
            return Invalid("input-size-limit");
        }

        return slug?.ToLowerInvariant() switch
        {
            "text-case" or "case-style-converter" or "dot-case-converter" => CaseStyles(text),
            "duplicate-word-finder" => DuplicateWords(text),
            "palindrome-checker" => Palindrome(text),
            "word-frequency-counter" => WordFrequency(text),
            "line-sorter" => SortLines(text, mode),
            "reading-time-estimator" => ReadingTime(text),
            "invisible-char-remover" => RemoveInvisibleCharacters(text),
            "lorem-ipsum-generator" => Lorem(number),
            "pig-latin" => PigLatin(text),
            "leetspeak" => Leetspeak(text),
            "uwu-speak" => Uwu(text),
            _ => Invalid("unknown-tool"),
        };
    }

    private static ExtendedTextToolResult CaseStyles(string text)
    {
        var words = TokenizeWords(text);
        var lower = string.Join(' ', words.Select(word => word.ToLowerInvariant()));
        var upper = lower.ToUpperInvariant();
        var title = string.Join(' ', words.Select(TitleWord));
        var sentence =
            words.Count == 0
                ? string.Empty
                : char.ToUpperInvariant(words[0][0])
                    + words[0][1..].ToLowerInvariant()
                    + (
                        words.Count > 1
                            ? " "
                                + string.Join(
                                    ' ',
                                    words.Skip(1).Select(word => word.ToLowerInvariant())
                                )
                            : string.Empty
                    );
        var camel =
            words.Count == 0
                ? string.Empty
                : words[0].ToLowerInvariant() + string.Concat(words.Skip(1).Select(TitleWord));
        var pascal = string.Concat(words.Select(TitleWord));
        var snake = string.Join('_', words.Select(word => word.ToLowerInvariant()));
        var kebab = string.Join('-', words.Select(word => word.ToLowerInvariant()));
        var dot = string.Join('.', words.Select(word => word.ToLowerInvariant()));
        var constant = upper.Replace(' ', '_');

        var output = string.Join(
            '\n',
            $"UPPER: {upper}",
            $"lower: {lower}",
            $"Title Case: {title}",
            $"Sentence case: {sentence}",
            $"camelCase: {camel}",
            $"PascalCase: {pascal}",
            $"snake_case: {snake}",
            $"kebab-case: {kebab}",
            $"dot.case: {dot}",
            $"CONSTANT_CASE: {constant}"
        );

        return Valid(output, words.Count);
    }

    private static ExtendedTextToolResult DuplicateWords(string text)
    {
        var rows = CountWords(text);
        var output =
            rows.Count == 0
                ? string.Empty
                : string.Join(
                    '\n',
                    rows.Where(row => row.Count > 1).Select(row => $"{row.Label}: {row.Count}")
                );
        return Valid(
            output,
            rows.Where(row => row.Count > 1).Sum(row => row.Count),
            rows.Where(row => row.Count > 1).ToArray()
        );
    }

    private static ExtendedTextToolResult Palindrome(string text)
    {
        var normalized = string.Concat(
            text.EnumerateRunes()
                .Where(rune => Rune.IsLetterOrDigit(rune))
                .Select(rune => rune.ToString().ToLowerInvariant())
        );
        var isPalindrome = normalized.Length > 0 && normalized.SequenceEqual(normalized.Reverse());
        return Valid(isPalindrome ? "true" : "false", isPalindrome ? 1 : 0);
    }

    private static ExtendedTextToolResult WordFrequency(string text)
    {
        var rows = CountWords(text);
        var output = string.Join('\n', rows.Select(row => $"{row.Label}: {row.Count}"));
        return Valid(output, rows.Sum(row => row.Count), rows);
    }

    private static ExtendedTextToolResult SortLines(string text, string? mode)
    {
        var lines = Lines(text).Where(line => line.Length > 0).ToArray();
        IEnumerable<string> sorted = mode?.ToLowerInvariant() switch
        {
            "za" or "desc" => lines.OrderByDescending(
                line => line,
                StringComparer.CurrentCultureIgnoreCase
            ),
            "numeric" => lines.OrderBy(line =>
                decimal.TryParse(
                    line.Trim(),
                    NumberStyles.Float,
                    CultureInfo.InvariantCulture,
                    out var value
                )
                    ? value
                    : decimal.MaxValue
            ),
            _ => lines.OrderBy(line => line, StringComparer.CurrentCultureIgnoreCase),
        };
        var result = sorted.ToArray();
        return Valid(string.Join('\n', result), result.Length);
    }

    private static ExtendedTextToolResult ReadingTime(string text)
    {
        var count = TokenizeWords(text).Count;
        var seconds = (int)Math.Ceiling(count * 60d / WordsPerMinute);
        var minutes = seconds / 60;
        var remainingSeconds = seconds % 60;
        return Valid($"{count} words\n{minutes}m {remainingSeconds}s", count);
    }

    private static ExtendedTextToolResult RemoveInvisibleCharacters(string text)
    {
        var invisible = text.EnumerateRunes().Where(IsInvisible).ToArray();
        var output = string.Concat(text.EnumerateRunes().Where(rune => !IsInvisible(rune)));
        return Valid(output, invisible.Length);
    }

    private static ExtendedTextToolResult Lorem(int number)
    {
        if (number is < 1 or > MaximumGeneratedParagraphs)
        {
            return Invalid("paragraph-limit");
        }

        var paragraphs = Enumerable
            .Range(0, number)
            .Select(index =>
                string.Join(
                    ' ',
                    LoremSentences.Select(
                        (sentence, sentenceIndex) =>
                            LoremSentences[(index + sentenceIndex) % LoremSentences.Length]
                    )
                )
            )
            .ToArray();
        return Valid(string.Join("\n\n", paragraphs), paragraphs.Length);
    }

    private static ExtendedTextToolResult PigLatin(string text)
    {
        var output = WordBoundaryRegex().Replace(text, match => PigLatinWord(match.Value));
        return Valid(output, TokenizeWords(text).Count);
    }

    private static ExtendedTextToolResult Leetspeak(string text)
    {
        return Valid(
            string.Concat(
                text.Select(character => LeetMap.GetValueOrDefault(character, character))
            ),
            text.Length
        );
    }

    private static ExtendedTextToolResult Uwu(string text)
    {
        var output = text.Replace("r", "w", StringComparison.OrdinalIgnoreCase)
            .Replace("l", "w", StringComparison.OrdinalIgnoreCase)
            .Replace("R", "W", StringComparison.Ordinal)
            .Replace("L", "W", StringComparison.Ordinal)
            .Replace("the", "da", StringComparison.OrdinalIgnoreCase)
            .Replace("you", "yu", StringComparison.OrdinalIgnoreCase);
        return Valid(output, text.Length);
    }

    private static string PigLatinWord(string word)
    {
        if (word.Length == 0)
            return word;
        var leadingUpper = char.IsUpper(word[0]);
        var lower = word.ToLowerInvariant();
        string result;
        if (IsPigLatinVowel(lower[0]))
        {
            result = lower + "way";
        }
        else
        {
            var splitIndex = 0;
            while (splitIndex < lower.Length && !IsPigLatinVowel(lower[splitIndex]))
            {
                splitIndex++;
            }
            if (
                splitIndex > 0
                && splitIndex < lower.Length
                && lower[splitIndex - 1] == 'q'
                && lower[splitIndex] == 'u'
            )
            {
                splitIndex++;
            }
            result = lower[splitIndex..] + lower[..splitIndex] + "ay";
        }
        return leadingUpper ? char.ToUpperInvariant(result[0]) + result[1..] : result;
    }

    private static bool IsPigLatinVowel(char character) => "aeiou".Contains(character);

    private static List<TextToolRow> CountWords(string text) =>
        TokenizeWords(text)
            .GroupBy(word => word.ToLowerInvariant(), StringComparer.Ordinal)
            .Select(group => new TextToolRow(group.Key, group.Count()))
            .OrderByDescending(row => row.Count)
            .ThenBy(row => row.Label, StringComparer.Ordinal)
            .ToList();

    private static List<string> TokenizeWords(string text) =>
        WordBoundaryRegex().Matches(text).Select(match => match.Value).ToList();

    private static string TitleWord(string word) =>
        word.Length == 0 ? word : char.ToUpperInvariant(word[0]) + word[1..].ToLowerInvariant();

    private static IEnumerable<string> Lines(string text) =>
        text.Replace("\r\n", "\n", StringComparison.Ordinal).Replace('\r', '\n').Split('\n');

    private static bool IsInvisible(Rune rune) =>
        rune.Value
            is 0x00AD
                or 0x034F
                or 0x061C
                or 0x180E
                or 0x200B
                or 0x200C
                or 0x200D
                or 0x200E
                or 0x200F
                or 0x202A
                or 0x202B
                or 0x202C
                or 0x202D
                or 0x202E
                or 0x2060
                or 0x2061
                or 0x2062
                or 0x2063
                or 0x2064
                or 0x2066
                or 0x2067
                or 0x2068
                or 0x2069
                or 0x206A
                or 0x206B
                or 0x206C
                or 0x206D
                or 0x206E
                or 0x206F
                or 0xFEFF;

    private static ExtendedTextToolResult Valid(
        string output,
        int count,
        IReadOnlyList<TextToolRow>? rows = null
    ) => new(true, output, rows ?? [], count);

    private static ExtendedTextToolResult Invalid(string error) =>
        new(false, string.Empty, [], 0, error);

    [GeneratedRegex(@"[\p{L}\p{M}\p{N}]+", RegexOptions.CultureInvariant)]
    private static partial Regex WordBoundaryRegex();
}
