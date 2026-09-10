using System.Net;

namespace Portfolio.Blazor.Core;

public sealed record QueryParameter(string Key, string Value);

public sealed record QueryStringParseResult(IReadOnlyList<QueryParameter> Parameters, string Query);

public static class QueryStringTools
{
    public static QueryStringParseResult Parse(string? input)
    {
        var raw = input?.Trim() ?? "";
        var question = raw.IndexOf('?');
        raw = question >= 0 ? raw[(question + 1)..] : raw.TrimStart('?');
        var parameters = raw.Split('&', StringSplitOptions.RemoveEmptyEntries)
            .Select(pair =>
            {
                var separator = pair.IndexOf('=');
                var key = separator < 0 ? pair : pair[..separator];
                var value = separator < 0 ? "" : pair[(separator + 1)..];
                return new QueryParameter(Decode(key), Decode(value));
            })
            .ToArray();
        return new(parameters, raw);
    }

    public static string Build(IEnumerable<QueryParameter> parameters) =>
        string.Join(
            '&',
            parameters
                .Where(parameter => !string.IsNullOrEmpty(parameter.Key))
                .Select(parameter =>
                    $"{WebUtility.UrlEncode(parameter.Key)}={WebUtility.UrlEncode(parameter.Value)}"
                )
        );

    private static string Decode(string value) =>
        WebUtility.UrlDecode(value.Replace('+', ' ')) ?? "";
}
