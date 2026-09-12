namespace Blog.Blazor.Stories.Stories.Feedback;

public partial class SiteConfirmDialog_stories
{
    private string _answer = "no answer yet";

    private async Task AskAsync()
    {
        var confirmed = await Dialogs.ConfirmAsync("apply changes?", "this updates the record.");
        _answer = confirmed ? "confirmed" : "cancelled";
        StateHasChanged();
    }

    private async Task AskDestructiveAsync()
    {
        var confirmed = await Dialogs.ConfirmAsync(
            "delete snippet?",
            "this cannot be undone.",
            destructive: true,
            confirmLabel: "delete"
        );
        _answer = confirmed ? "confirmed" : "cancelled";
        StateHasChanged();
    }
}
