namespace Portfolio.Blazor.UI.Composition;

/// <summary>The item and its position, handed to each SiteRepeatableItems row template.</summary>
/// <typeparam name="TItem">Type of the repeated item.</typeparam>
public sealed class SiteRepeatableItemContext<TItem>
{
    /// <summary>Creates a context for one rendered row.</summary>
    /// <param name="item">The item being rendered.</param>
    /// <param name="index">Its zero-based position in the list.</param>
    public SiteRepeatableItemContext(TItem item, int index)
    {
        Item = item;
        Index = index;
    }

    /// <summary>The item being rendered.</summary>
    public TItem Item { get; }

    /// <summary>Zero-based position of the item in the list.</summary>
    public int Index { get; }
}
