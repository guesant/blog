namespace Blog.Blazor.UI.Foundations;

/// <summary>A single transient message shown by SiteToastHost.</summary>
public sealed record SiteToast(Guid Id, string Message, SiteTone Tone);

/// <summary>Queues transient messages for the host rendered by the layout.</summary>
public sealed class SiteToastService
{
    private readonly List<SiteToast> _toasts = [];

    /// <summary>Raised whenever the visible set of toasts changes.</summary>
    public event Action? Changed;

    /// <summary>Currently visible toasts, oldest first.</summary>
    public IReadOnlyList<SiteToast> Toasts => _toasts;

    /// <summary>Shows a success message.</summary>
    public void Success(string message) => Add(message, SiteTone.Success);

    /// <summary>Shows an error message.</summary>
    public void Error(string message) => Add(message, SiteTone.Danger);

    /// <summary>Shows a neutral informational message.</summary>
    public void Info(string message) => Add(message, SiteTone.Info);

    /// <summary>Removes a toast, typically when its host dismisses it.</summary>
    public void Dismiss(Guid id)
    {
        if (_toasts.RemoveAll(toast => toast.Id == id) > 0)
        {
            Changed?.Invoke();
        }
    }

    private void Add(string message, SiteTone tone)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            return;
        }

        _toasts.Add(new SiteToast(Guid.NewGuid(), message, tone));
        Changed?.Invoke();
    }
}
