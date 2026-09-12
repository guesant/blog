using Blog.Blazor.Core;

namespace Blog.Blazor.Stories.Stories.Forms;

public partial class SiteContentFactInput_stories
{
    private string? _bookValue =
        "{\"isbn\":\"978-1449373320\",\"publisher\":\"O'Reilly Media\",\"edition\":\"1st\",\"pages\":616}";
    private string? _bookEmitted;

    private string? _repoValue =
        "{\"org\":\"etcd-io\",\"name\":\"etcd\",\"language\":\"Go\",\"license\":\"Apache-2.0\"}";
    private string? _repoEmitted;

    private string? _paperValue = "{\"conference\":\"USENIX ATC\",\"year\":\"2014\"}";
    private string? _paperEmitted;

    private string? _videoValue =
        "{\"channel\":\"Software Engineering Explained\",\"duration\":\"18:42\",\"youtubeId\":\"example-raft-refresher\"}";
    private string? _videoEmitted;

    private string? _articleValue =
        "{\"isbn\":\"978-1449373320\",\"publisher\":\"O'Reilly Media\"}";

    private ContentFactContentType _switchType = ContentFactContentType.Book;
    private string? _switchValue = "{\"isbn\":\"978-1449373320\",\"publisher\":\"O'Reilly Media\"}";
}
