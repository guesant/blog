using Blog.Blazor.Core;

namespace Blog.Blazor.Client.Shared;

public static class TopicTree
{
    private const int DefaultMaxDepth = 8;

    public static IReadOnlyList<string> SubtreeSlugs(
        IReadOnlyList<PublicTopic>? topics,
        string? slug
    )
    {
        if (topics is null || string.IsNullOrWhiteSpace(slug))
            return [];

        var result = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { slug };
        var frontier = new Queue<string>();
        frontier.Enqueue(slug);
        while (frontier.Count > 0)
        {
            var current = frontier.Dequeue();
            foreach (
                var child in topics.Where(item =>
                    item.ParentSlug is not null
                    && item.ParentSlug.Equals(current, StringComparison.OrdinalIgnoreCase)
                )
            )
            {
                if (result.Add(child.Slug))
                    frontier.Enqueue(child.Slug);
            }
        }
        return result.ToArray();
    }

    public static IReadOnlyList<string> SubtreeSlugAndNameSet(
        IReadOnlyList<PublicTopic>? topics,
        string? nameOrSlug
    )
    {
        if (topics is null || string.IsNullOrWhiteSpace(nameOrSlug))
            return [];

        var root = topics.FirstOrDefault(item =>
            item.Slug.Equals(nameOrSlug, StringComparison.OrdinalIgnoreCase)
            || (item.Name?.Equals(nameOrSlug, StringComparison.OrdinalIgnoreCase) ?? false)
        );
        if (root is null)
            return [nameOrSlug];

        var slugs = SubtreeSlugs(topics, root.Slug);
        return topics
            .Where(item => slugs.Contains(item.Slug))
            .Select(item => item.Name ?? item.Slug)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }

    public static IReadOnlyList<PublicTopic> Ancestors(
        IReadOnlyList<PublicTopic>? topics,
        PublicTopic? topic,
        int maxDepth = DefaultMaxDepth
    )
    {
        if (topics is null || topic is null)
            return [];

        var chain = new List<PublicTopic>();
        var visited = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { topic.Slug };
        var current = topic;
        var depth = 0;
        while (
            depth < maxDepth
            && !string.IsNullOrWhiteSpace(current.ParentSlug)
            && visited.Add(current.ParentSlug)
        )
        {
            var parent = topics.FirstOrDefault(item =>
                item.Slug.Equals(current!.ParentSlug, StringComparison.OrdinalIgnoreCase)
            );
            if (parent is null)
                break;
            chain.Add(parent);
            current = parent;
            depth++;
        }
        chain.Reverse();
        return chain;
    }
}
