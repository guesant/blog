namespace Portfolio.Blazor.Core;

public readonly record struct TextStatistics(
    int Characters,
    int CharactersWithoutSpaces,
    int Words,
    int Sentences,
    int Lines,
    int Paragraphs
);

public static class TextStatisticsCalculator
{
    public static TextStatistics Analyze(string? value)
    {
        var text = value ?? string.Empty;

        return new TextStatistics(
            Characters: text.Length,
            CharactersWithoutSpaces: CountCharactersWithoutSpaces(text),
            Words: CountWords(text),
            Sentences: CountSentences(text),
            Lines: CountLines(text),
            Paragraphs: CountParagraphs(text)
        );
    }

    private static int CountCharactersWithoutSpaces(string text)
    {
        var count = 0;

        foreach (var character in text)
        {
            if (!char.IsWhiteSpace(character))
            {
                count++;
            }
        }

        return count;
    }

    private static int CountWords(string text)
    {
        var count = 0;
        var inWord = false;

        foreach (var character in text)
        {
            if (char.IsWhiteSpace(character))
            {
                inWord = false;
                continue;
            }

            if (!inWord)
            {
                count++;
                inWord = true;
            }
        }

        return count;
    }

    private static int CountSentences(string text)
    {
        var count = 0;
        var hasContent = false;
        var hasTerminator = false;

        foreach (var character in text)
        {
            if (char.IsWhiteSpace(character))
            {
                continue;
            }

            hasContent = true;

            if (character is '.' or '!' or '?')
            {
                if (!hasTerminator)
                {
                    count++;
                    hasTerminator = true;
                }

                continue;
            }

            hasTerminator = false;
        }

        return hasContent && !hasTerminator ? count + 1 : count;
    }

    private static int CountLines(string text)
    {
        if (text.Length == 0)
        {
            return 0;
        }

        var count = 1;

        foreach (var character in text)
        {
            if (character == '\n')
            {
                count++;
            }
        }

        return count;
    }

    private static int CountParagraphs(string text)
    {
        var count = 0;
        var hasContent = false;
        var blankLine = false;

        foreach (var character in text)
        {
            if (character == '\n')
            {
                if (blankLine && hasContent)
                {
                    count++;
                    hasContent = false;
                }

                blankLine = true;
                continue;
            }

            if (!char.IsWhiteSpace(character))
            {
                hasContent = true;
                blankLine = false;
            }
        }

        return hasContent ? count + 1 : count;
    }
}
