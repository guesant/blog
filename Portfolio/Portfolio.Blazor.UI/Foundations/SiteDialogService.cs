namespace Portfolio.Blazor.UI.Foundations;

/// <summary>A confirmation awaiting the user's answer, rendered by SiteConfirmDialog.</summary>
public sealed record SiteConfirmRequest(
    string Title,
    string Description,
    string ConfirmLabel,
    string CancelLabel,
    bool Destructive
);

/// <summary>Asks the user to confirm an action and awaits the answer.</summary>
public sealed class SiteDialogService
{
    private TaskCompletionSource<bool>? _pending;

    /// <summary>Raised when a confirmation opens or closes.</summary>
    public event Action? Changed;

    /// <summary>The confirmation currently on screen, if any.</summary>
    public SiteConfirmRequest? Current { get; private set; }

    /// <summary>Opens a confirmation and completes once the user answers.</summary>
    public Task<bool> ConfirmAsync(
        string title,
        string description,
        bool destructive = false,
        string confirmLabel = "confirm",
        string cancelLabel = "cancel"
    )
    {
        _pending?.TrySetResult(false);
        Current = new SiteConfirmRequest(
            title,
            description,
            confirmLabel,
            cancelLabel,
            destructive
        );
        _pending = new TaskCompletionSource<bool>(
            TaskCreationOptions.RunContinuationsAsynchronously
        );
        Changed?.Invoke();
        return _pending.Task;
    }

    /// <summary>Answers the open confirmation.</summary>
    public void Answer(bool confirmed)
    {
        Current = null;
        var pending = _pending;
        _pending = null;
        Changed?.Invoke();
        pending?.TrySetResult(confirmed);
    }
}
