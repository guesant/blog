namespace Portfolio.Blazor.Core;

public static class GitignoreTemplates
{
    public static IReadOnlyDictionary<string, IReadOnlyList<string>> All { get; } =
        new Dictionary<string, IReadOnlyList<string>>
        {
            ["Node"] =
            [
                "node_modules/",
                "npm-debug.log*",
                "yarn-debug.log*",
                "yarn-error.log*",
                ".pnpm-debug.log*",
                ".npm",
                ".yarn/cache",
                ".yarn/install-state.gz",
                "dist/",
                "build/",
                "coverage/",
                ".env",
                ".env.local",
            ],
            ["PHP / Laravel"] =
            [
                "/vendor/",
                "/node_modules/",
                "/public/hot",
                "/public/storage",
                "/storage/*.key",
                "/storage/pail",
                "/bootstrap/cache/*.php",
                ".env",
                ".env.backup",
                ".env.production",
                ".phpunit.result.cache",
                "Homestead.json",
                "Homestead.yaml",
                "auth.json",
            ],
            ["Python"] =
            [
                "__pycache__/",
                "*.py[cod]",
                "*$py.class",
                "*.egg-info/",
                ".eggs/",
                ".venv/",
                "venv/",
                "env/",
                ".mypy_cache/",
                ".pytest_cache/",
                ".tox/",
                "dist/",
                "build/",
                "*.log",
            ],
            ["Java"] =
            [
                "*.class",
                "*.jar",
                "*.war",
                "*.ear",
                "target/",
                ".gradle/",
                "build/",
                "out/",
                ".mtj.tmp/",
                "hs_err_pid*",
                "replay_pid*",
            ],
            ["macOS"] =
            [
                ".DS_Store",
                ".AppleDouble",
                ".LSOverride",
                "Icon\r",
                "._*",
                ".DocumentRevisions-V100",
                ".fseventsd",
                ".Spotlight-V100",
                ".TemporaryItems",
                ".Trashes",
            ],
            ["Windows"] =
            [
                "Thumbs.db",
                "Thumbs.db:encryptable",
                "ehthumbs.db",
                "ehthumbs_vista.db",
                "Desktop.ini",
                "$RECYCLE.BIN/",
                "*.lnk",
            ],
            ["VS Code"] =
            [
                ".vscode/*",
                "!.vscode/extensions.json",
                "!.vscode/settings.json",
                "*.code-workspace",
            ],
            ["JetBrains / IDEA"] =
            [
                ".idea/",
                "*.iml",
                "*.iws",
                "*.ipr",
                "out/",
                ".idea_modules/",
                "cmake-build-*/",
            ],
        };

    public static string Build(IEnumerable<string> selected)
    {
        var sections = selected
            .Where(All.ContainsKey)
            .Select(name => $"### {name} ###\n{string.Join('\n', All[name])}");
        var output = string.Join("\n\n", sections);
        return output.Length == 0 ? string.Empty : output + "\n";
    }
}
