using Microsoft.AspNetCore.Components;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Portfolio.Blazor.Data;
using Portfolio.Blazor.Data.Providers;
using Portfolio.Blazor.UI.Foundations;

namespace Portfolio.Blazor.Components.Admin;

public abstract partial class AdminListPageBase<TEntity> : AdminComponentBase
    where TEntity : class
{
    [Inject]
    protected IDbContextFactory<PortfolioAdminDbContext> DbContextFactory { get; set; } = default!;

    [Inject]
    protected IDatabaseProvider DatabaseProvider { get; set; } = default!;

    [Inject]
    protected SiteDialogService DialogService { get; set; } = default!;

    [Inject]
    protected SiteToastService ToastService { get; set; } = default!;

    [Inject]
    protected ILogger<AdminListPageBase<TEntity>> Logger { get; set; } = default!;

    [Inject]
    protected NavigationManager Navigation { get; set; } = default!;

    [SupplyParameterFromQuery(Name = "page")]
    protected int? QueryPage { get; set; }

    protected const int PageSize = 20;

    protected List<TEntity> Items { get; private set; } = [];
    protected int TotalPages => Math.Max(1, (int)Math.Ceiling(Items.Count / (double)PageSize));
    protected int CurrentPage => Math.Clamp(QueryPage ?? 1, 1, TotalPages);
    protected IReadOnlyList<TEntity> PageItems =>
        Items.Skip((CurrentPage - 1) * PageSize).Take(PageSize).ToList();

    protected string PageUrl(int page) => Navigation.GetUriWithQueryParameter("page", page);

    protected bool IsOrderMode =>
        new Uri(Navigation.Uri)
            .AbsolutePath.TrimEnd('/')
            .EndsWith("/order", StringComparison.OrdinalIgnoreCase);
    protected bool IsSaving { get; private set; }
    protected bool IsLoading { get; private set; } = true;
    protected string? Error { get; private set; }

    protected abstract string EntityLabel { get; }
    protected abstract Task<List<TEntity>> LoadEntitiesAsync(PortfolioAdminDbContext dbContext);
    protected abstract Task<TEntity?> FindTrackedAsync(PortfolioAdminDbContext dbContext, int id);
    protected abstract string DisplayTitle(TEntity entity);
    protected abstract int GetId(TEntity entity);

    protected virtual void SetOrder(TEntity entity, int order) =>
        throw new NotSupportedException($"{typeof(TEntity).Name} has no display order.");

    protected void HandleReorder((int OldIndex, int NewIndex) change) => StateHasChanged();

    protected async Task HandleSaveOrderAsync(string listRoute)
    {
        if (IsSaving)
        {
            return;
        }

        Error = null;
        IsSaving = true;
        try
        {
            await using var dbContext = await DbContextFactory.CreateDbContextAsync();
            await using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                for (var index = 0; index < Items.Count; index++)
                {
                    var tracked = await FindTrackedAsync(dbContext, GetId(Items[index]));
                    if (tracked is not null)
                    {
                        SetOrder(tracked, index);
                    }
                }

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
                await DatabaseProvider.SignalContentChangedAsync(dbContext);
            }
            catch (Exception checkpointException)
            {
                LogCheckpointFailed(Logger, checkpointException, typeof(TEntity).Name, 0);
            }

            ToastService.Success("Order saved.");
            Navigation.NavigateTo(listRoute);
        }
        catch (Exception exception)
        {
            LogDeleteFailed(Logger, exception, typeof(TEntity).Name, 0);
            Error = "Could not save the order. Please try again.";
            ToastService.Error(Error);
        }
        finally
        {
            IsSaving = false;
        }
    }

    protected virtual Task RemoveAsync(PortfolioAdminDbContext dbContext, TEntity tracked)
    {
        dbContext.Set<TEntity>().Remove(tracked);
        return Task.CompletedTask;
    }

    protected virtual string DeleteConfirmTitle(TEntity entity) =>
        $"Delete \"{DisplayTitle(entity)}\"?";

    protected virtual string DeleteConfirmDescription(TEntity entity) =>
        $"This permanently removes the {EntityLabel}. This cannot be undone.";

    protected virtual string DeleteSuccessMessage =>
        $"{char.ToUpperInvariant(EntityLabel[0])}{EntityLabel[1..]} deleted.";
    protected virtual string DeleteErrorMessage =>
        $"Could not delete the {EntityLabel}. Please try again.";

    protected override async Task OnInitializedAsync() => await LoadAsync();

    protected async Task LoadAsync()
    {
        IsLoading = true;
        await using var dbContext = await DbContextFactory.CreateDbContextAsync();
        Items = await LoadEntitiesAsync(dbContext);
        IsLoading = false;
    }

    protected async Task HandleDeleteAsync(TEntity entity)
    {
        Error = null;

        var confirmed = await DialogService.ConfirmAsync(
            DeleteConfirmTitle(entity),
            DeleteConfirmDescription(entity),
            destructive: true
        );

        if (!confirmed)
        {
            return;
        }

        var id = GetId(entity);

        try
        {
            await using var dbContext = await DbContextFactory.CreateDbContextAsync();
            await using var transaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                var tracked = await FindTrackedAsync(dbContext, id);
                if (tracked is not null)
                {
                    await RemoveAsync(dbContext, tracked);
                    await dbContext.SaveChangesAsync();
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }

            try
            {
                await DatabaseProvider.SignalContentChangedAsync(dbContext);
            }
            catch (Exception checkpointException)
            {
                LogCheckpointFailed(Logger, checkpointException, typeof(TEntity).Name, id);
            }

            ToastService.Success(DeleteSuccessMessage);
            await LoadAsync();
        }
        catch (Exception exception)
        {
            LogDeleteFailed(Logger, exception, typeof(TEntity).Name, id);
            Error = DeleteErrorMessage;
            ToastService.Error(Error);
        }
    }

    [LoggerMessage(
        EventId = 3001,
        Level = LogLevel.Warning,
        Message = "Checkpoint after deleting {EntityType} {EntityId} failed; the public site may briefly serve stale content"
    )]
    private static partial void LogCheckpointFailed(
        ILogger logger,
        Exception exception,
        string entityType,
        int entityId
    );

    [LoggerMessage(
        EventId = 3002,
        Level = LogLevel.Error,
        Message = "Failed to delete {EntityType} {EntityId}"
    )]
    private static partial void LogDeleteFailed(
        ILogger logger,
        Exception exception,
        string entityType,
        int entityId
    );
}
