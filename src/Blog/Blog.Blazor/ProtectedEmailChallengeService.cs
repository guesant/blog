using Blog.Blazor.Core;

namespace Blog.Blazor;

public sealed class ProtectedEmailChallengeService
{
    private readonly SemaphoreSlim _generationGate = new(1, 1);

    public async Task<PublicProtectedEmailChallenge?> CreateAsync(
        string? email,
        CancellationToken cancellationToken = default
    )
    {
        if (string.IsNullOrWhiteSpace(email))
            return null;

        await _generationGate.WaitAsync(cancellationToken);
        try
        {
            return await Task.Run(
                () => ProtectedEmailChallenge.Create(email),
                CancellationToken.None
            );
        }
        finally
        {
            _generationGate.Release();
        }
    }
}
