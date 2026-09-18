namespace Blog.Blazor.Popularity;

public enum PopularityKind
{
    Github,
    Youtube,
    Hn,
}

public sealed record CliOptions(PopularityKind Kind, bool DryRun, string? InputPath)
{
    public static CliOptions? Parse(string[] args)
    {
        PopularityKind? kind = null;
        var dryRun = false;
        string? inputPath = null;

        for (var i = 0; i < args.Length; i++)
        {
            switch (args[i])
            {
                case "--kind":
                    kind = args[++i] switch
                    {
                        "github" => PopularityKind.Github,
                        "youtube" => PopularityKind.Youtube,
                        "hn" => PopularityKind.Hn,
                        var value => throw new ArgumentException($"Unknown kind '{value}'."),
                    };
                    break;
                case "--dry-run":
                    dryRun = true;
                    break;
                case "--input":
                    inputPath = args[++i];
                    break;
                default:
                    Console.Error.WriteLine($"Unknown argument '{args[i]}'.");
                    return null;
            }
        }

        if (kind is null)
        {
            Console.Error.WriteLine("Usage: --kind github|youtube|hn [--dry-run] [--input <path>]");
            return null;
        }

        if (kind == PopularityKind.Youtube && string.IsNullOrWhiteSpace(inputPath))
        {
            Console.Error.WriteLine("--kind youtube requires --input <path>.");
            return null;
        }

        return new CliOptions(kind.Value, dryRun, inputPath);
    }
}

public static class PopularityKindExtensions
{
    public static string ToKindLabel(this PopularityKind kind) =>
        kind switch
        {
            PopularityKind.Github => "github-stars",
            PopularityKind.Youtube => "youtube-views",
            PopularityKind.Hn => "hn-points",
            _ => throw new ArgumentOutOfRangeException(nameof(kind)),
        };
}
