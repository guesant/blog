namespace Blog.Blazor.Core;

public sealed class Debouncer : IDisposable
{
    private readonly TimeSpan _delay;
    private CancellationTokenSource? _cts;

    public Debouncer(TimeSpan delay)
    {
        _delay = delay;
    }

    public void Trigger(Func<Task> action)
    {
        _cts?.Cancel();
        _cts?.Dispose();
        var cts = new CancellationTokenSource();
        _cts = cts;
        var token = cts.Token;

        _ = RunAsync(action, cts, token);
    }

    public void Trigger(Action action) =>
        Trigger(() =>
        {
            action();
            return Task.CompletedTask;
        });

    private async Task RunAsync(
        Func<Task> action,
        CancellationTokenSource owner,
        CancellationToken token
    )
    {
        try
        {
            await Task.Delay(_delay, token);
        }
        catch (TaskCanceledException)
        {
            return;
        }

        if (token.IsCancellationRequested)
        {
            return;
        }

        await action();

        if (ReferenceEquals(_cts, owner))
        {
            owner.Dispose();
            _cts = null;
        }
    }

    public void Dispose()
    {
        _cts?.Cancel();
        _cts?.Dispose();
        _cts = null;
    }
}
