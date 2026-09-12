namespace Blog.Blazor.Data.Entities;

// IMPORTANT: `topicables` is a shared polymorphic table (topicable_type in
// "writing"/"finding") tagging both Writing and Resource rows with Topics.
// It has its own autoincrement `id`, not a composite key. Never add a
// dedicated Topic navigation/FK on Writing or Resource — always filter by
// TopicableType alongside TopicableId, and never touch rows of the other type.
public sealed class Topicable
{
    public int Id { get; set; }
    public int TopicId { get; set; }
    public string TopicableType { get; set; } = string.Empty;
    public int TopicableId { get; set; }
    public string? Role { get; set; }

    public Topic? Topic { get; set; }
}
