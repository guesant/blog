namespace Portfolio.Blazor.Core;

public sealed record MorseResult(bool IsValid, string Output, string? Error);

public static class MorseCode
{
    private static readonly Dictionary<char, string> Map = new()
    {
        ['A'] = ".-",
        ['B'] = "-...",
        ['C'] = "-.-.",
        ['D'] = "-..",
        ['E'] = ".",
        ['F'] = "..-.",
        ['G'] = "--.",
        ['H'] = "....",
        ['I'] = "..",
        ['J'] = ".---",
        ['K'] = "-.-",
        ['L'] = ".-..",
        ['M'] = "--",
        ['N'] = "-.",
        ['O'] = "---",
        ['P'] = ".--.",
        ['Q'] = "--.-",
        ['R'] = ".-.",
        ['S'] = "...",
        ['T'] = "-",
        ['U'] = "..-",
        ['V'] = "...-",
        ['W'] = ".--",
        ['X'] = "-..-",
        ['Y'] = "-.--",
        ['Z'] = "--..",
        ['0'] = "-----",
        ['1'] = ".----",
        ['2'] = "..---",
        ['3'] = "...--",
        ['4'] = "....-",
        ['5'] = ".....",
        ['6'] = "-....",
        ['7'] = "--...",
        ['8'] = "---..",
        ['9'] = "----.",
        ['.'] = ".-.-.-",
        [','] = "--..--",
        ['?'] = "..--..",
        ['\''] = ".----.",
        ['!'] = "-.-.--",
        ['/'] = "-..-.",
        ['('] = "-.--.",
        [')'] = "-.--.-",
        ['&'] = ".-...",
        [':'] = "---...",
        [';'] = "-.-.-.",
        ['='] = "-...-",
        ['+'] = ".-.-.",
        ['-'] = "-....-",
        ['_'] = "..--.-",
        ['"'] = ".-..-.",
        ['$'] = "...-..-",
        ['@'] = ".--.-.",
    };
    private static readonly Dictionary<string, char> Reverse = Map.ToDictionary(
        pair => pair.Value,
        pair => pair.Key
    );

    public static MorseResult Transform(string? input, string direction)
    {
        if (string.IsNullOrWhiteSpace(input))
            return new(true, "", null);
        if (direction == "encode")
            return new(
                true,
                string.Join(
                    " / ",
                    input
                        .ToUpperInvariant()
                        .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)
                        .Select(word =>
                            string.Join(
                                ' ',
                                word.Select(character =>
                                        Map.TryGetValue(character, out var code) ? code : ""
                                    )
                                    .Where(code => code.Length > 0)
                            )
                        )
                ),
                null
            );
        try
        {
            return new(
                true,
                string.Join(
                    ' ',
                    input
                        .Trim()
                        .Split('/')
                        .Select(word =>
                            string.Concat(
                                word.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(code =>
                                        Reverse.TryGetValue(code, out var character)
                                            ? character
                                            : throw new FormatException(code)
                                    )
                            )
                        )
                ),
                null
            );
        }
        catch (FormatException exception)
        {
            return new(false, "", exception.Message);
        }
    }
}
