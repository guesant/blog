namespace Portfolio.Blazor.Core;

public static class PhoneticAlphabetConverter
{
    private static readonly IReadOnlyDictionary<
        string,
        IReadOnlyDictionary<char, string>
    > Alphabets = new Dictionary<string, IReadOnlyDictionary<char, string>>
    {
        ["nato"] = Words(
            "Alpha Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu",
            ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Niner"]
        ),
        ["brazilian"] = Words(
            "Amor Bola Casa Dado Estrela Faca Gato Hotel Igreja Jacaré Kiwi Livro Maria Navio Ovo Pedro Quilo Rio Sapato Tatu Urubu Vitória Wagner Xadrez Yolanda Zebra",
            ["Zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove"]
        ),
        ["german"] = Words(
            "Anton Berta Cäsar Dora Emil Friedrich Gustav Heinrich Ida Julius Kaufmann Ludwig Martha Nordpol Otto Paula Quelle Richard Samuel Theodor Ulrich Viktor Wilhelm Xanthippe Ypsilon Zeppelin",
            ["Null", "Eins", "Zwei", "Drei", "Vier", "Fünf", "Sechs", "Sieben", "Acht", "Neun"]
        ),
    };

    public static string Convert(string? text, string? alphabet)
    {
        var words = Alphabets.TryGetValue(alphabet ?? "nato", out var selected)
            ? selected
            : Alphabets["nato"];
        return string.Join(
            '\n',
            (text ?? string.Empty)
                .Where(character => !char.IsWhiteSpace(character))
                .Select(character =>
                    words.TryGetValue(char.ToLowerInvariant(character), out var word) ? word
                    : char.IsDigit(character) && words.TryGetValue(character, out word) ? word
                    : character.ToString()
                )
        );
    }

    private static IReadOnlyDictionary<char, string> Words(string letters, string[] digits) =>
        letters
            .Split(' ')
            .Select((word, index) => new { Key = (char)('a' + index), Word = word })
            .Concat(digits.Select((word, index) => new { Key = (char)('0' + index), Word = word }))
            .ToDictionary(item => item.Key, item => item.Word);
}
