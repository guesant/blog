namespace Blog.Blazor.UI.Feedback;

public partial class SiteConfirmDialog
{
    private ElementReference _dialogRef;
    private bool _shouldFocus;

    protected override void OnInitialized() => Dialogs.Changed += HandleChanged;

    private void HandleChanged()
    {
        _shouldFocus = Dialogs.Current is not null;
        InvokeAsync(StateHasChanged);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!_shouldFocus || Dialogs.Current is null)
        {
            return;
        }

        _shouldFocus = false;
        await _dialogRef.FocusAsync();
        await TryInvokeVoidAsync("SiteFocusTrap.trap", _dialogRef);
    }

    private async Task Confirm()
    {
        await TryInvokeVoidAsync("SiteFocusTrap.restoreFocus");
        Dialogs.Answer(true);
    }

    private async Task Cancel()
    {
        await TryInvokeVoidAsync("SiteFocusTrap.restoreFocus");
        Dialogs.Answer(false);
    }

    // IMPORTANT: swallows JSException so a missing/not-yet-loaded focus-trap script (e.g. a host
    // page, like the Stories harness, that doesn't include App.razor's script tag) degrades to "no
    // trap" instead of breaking the dialog's actual confirm/cancel behavior.
    private async Task TryInvokeVoidAsync(string identifier, params object?[] args)
    {
        try
        {
            await JS.InvokeVoidAsync(identifier, args);
        }
        catch (JSException) { }
    }

    private Task HandleKeyDown(KeyboardEventArgs args) =>
        args.Key == "Escape" ? Cancel() : Task.CompletedTask;

    public void Dispose()
    {
        Dialogs.Changed -= HandleChanged;
        GC.SuppressFinalize(this);
    }
}
