using Microsoft.AspNetCore.Authorization;

namespace Blog.Blazor.Components.Admin.Shared;

public partial class AdminOrderEditor<TItem>
{
    [Parameter, EditorRequired]
    public string Title { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public string ListRoute { get; set; } = string.Empty;

    [Parameter, EditorRequired]
    public IList<TItem> Items { get; set; } = [];

    [Parameter, EditorRequired]
    public Func<TItem, string> DisplayTitle { get; set; } = default!;

    [Parameter]
    public bool IsLoading { get; set; }

    [Parameter]
    public bool IsSaving { get; set; }

    [Parameter]
    public string? Error { get; set; }

    [Parameter]
    public EventCallback<(int OldIndex, int NewIndex)> OnReordered { get; set; }

    [Parameter]
    public EventCallback OnSave { get; set; }
}
