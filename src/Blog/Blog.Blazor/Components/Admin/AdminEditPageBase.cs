using Blog.Blazor.Data;
using Blog.Blazor.UI.Foundations;
using Microsoft.AspNetCore.Components;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Blog.Blazor.Components.Admin;

public abstract partial class AdminEditPageBase<TEntity> : AdminComponentBase
    where TEntity : class
{
    [Inject]
    protected IDbContextFactory<BlogAdminDbContext> DbContextFactory { get; set; } = default!;

    [Inject]
    protected ContentRevisionTracker ContentRevisions { get; set; } = default!;

    [Inject]
    protected SiteToastService ToastService { get; set; } = default!;

    [Inject]
    protected NavigationManager Navigation { get; set; } = default!;

    [Inject]
    protected ILogger<AdminEditPageBase<TEntity>> Logger { get; set; } = default!;

    protected bool IsLoading { get; set; } = true;
    protected bool IsSaving { get; private set; }
    protected string? SaveError { get; set; }

    protected abstract string EntityLabel { get; }
    protected abstract string ListRoute { get; }
    protected abstract Task LoadAsync(BlogAdminDbContext dbContext);
    protected abstract Task<bool> ValidateAsync();
    protected abstract Task ApplyChangesAsync(BlogAdminDbContext dbContext);

    protected static string? NullIfBlank(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value;

    protected static async Task<int> NextOrderAsync<T>(
        IQueryable<T> set,
        System.Linq.Expressions.Expression<Func<T, int>> order
    ) => (await set.Select(order).DefaultIfEmpty(-1).MaxAsync()) + 1;

    protected override async Task OnInitializedAsync()
    {
        IsLoading = true;
        await using var dbContext = await DbContextFactory.CreateDbContextAsync();
        await LoadAsync(dbContext);
        IsLoading = false;
    }

    protected async Task HandleSaveAsync()
    {
        if (IsSaving)
        {
            return;
        }

        SaveError = null;

        if (!await ValidateAsync())
        {
            return;
        }

        IsSaving = true;
        try
        {
            await using var dbContext = await DbContextFactory.CreateDbContextAsync();
            await using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                await ApplyChangesAsync(dbContext);
                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            try
            {
                await ContentRevisions.SignalContentChangedAsync(dbContext);
            }
            catch (Exception checkpointException)
            {
                LogCheckpointFailed(Logger, checkpointException, typeof(TEntity).Name);
            }

            ToastService.Success($"{EntityLabel} saved.");
            Navigation.NavigateTo(ListRoute);
        }
        catch (Exception exception)
        {
            LogSaveFailed(Logger, exception, typeof(TEntity).Name);
            SaveError = $"Could not save the {EntityLabel}. Please try again.";
            ToastService.Error(SaveError);
        }
        finally
        {
            IsSaving = false;
        }
    }

    [LoggerMessage(
        EventId = 3101,
        Level = LogLevel.Warning,
        Message = "Checkpoint after saving {EntityType} failed; the public site may briefly serve stale content"
    )]
    private static partial void LogCheckpointFailed(
        ILogger logger,
        Exception exception,
        string entityType
    );

    [LoggerMessage(EventId = 3102, Level = LogLevel.Error, Message = "Failed to save {EntityType}")]
    private static partial void LogSaveFailed(
        ILogger logger,
        Exception exception,
        string entityType
    );
}
