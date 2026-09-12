namespace Blog.Blazor.Core;

public static class CaesarCipher
{
    public static string Transform(string? input, int shift, bool decode = false)
    {
        if (string.IsNullOrEmpty(input))
            return string.Empty;
        var effectiveShift = decode ? -shift : shift;
        return string.Concat(input.Select(character => ShiftCharacter(character, effectiveShift)));
    }

    private static char ShiftCharacter(char character, int shift)
    {
        var baseCode =
            character is >= 'A' and <= 'Z' ? 'A'
            : character is >= 'a' and <= 'z' ? 'a'
            : '\0';
        if (baseCode == '\0')
            return character;
        var normalized = ((shift % 26) + 26) % 26;
        return (char)(baseCode + (character - baseCode + normalized) % 26);
    }
}
