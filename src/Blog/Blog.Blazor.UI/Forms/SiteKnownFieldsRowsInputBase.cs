namespace Blog.Blazor.UI.Forms;

/// <summary>Shared "known field vs free-form row" bookkeeping for discriminator-driven key/value editors
/// (SiteContentFactInput, SitePageFieldsInput): a subset of the JSON object's keys is rendered as labeled
/// inputs for the active discriminator, and anything else stays a free-form key/value row so no data is
/// ever silently dropped when the discriminator changes.</summary>
public abstract class SiteKnownFieldsRowsInputBase : SiteKeyValueRowsInputBase
{
    /// <summary>Whether <paramref name="key"/> is a known field for the active discriminator.</summary>
    protected abstract bool IsKnownKey(string key);

    /// <summary>Every key the catalog defines for any discriminator, used to canonicalize a typed free-form key.</summary>
    protected abstract IEnumerable<string> AllKnownKeys { get; }

    /// <summary>Indices into <see cref="SiteKeyValueRowsInputBase.Rows"/> not recognized for the active discriminator.</summary>
    protected IReadOnlyList<int> FreeFormIndices =>
        Enumerable.Range(0, Rows.Count).Where(index => !IsKnownKey(Rows[index].Key)).ToList();

    private int FindRowIndex(string canonicalKey) =>
        Rows.FindIndex(row =>
            string.Equals(row.Key, canonicalKey, StringComparison.OrdinalIgnoreCase)
        );

    /// <summary>The current value for a known field, or empty if the row doesn't exist yet.</summary>
    protected string KnownValue(string canonicalKey)
    {
        var index = FindRowIndex(canonicalKey);
        return index >= 0 ? Rows[index].Value : string.Empty;
    }

    /// <summary>Sets (or removes, if blank) the row for a known field and notifies.</summary>
    protected void SetKnownValue(string canonicalKey, string value)
    {
        var index = FindRowIndex(canonicalKey);
        if (string.IsNullOrWhiteSpace(value))
        {
            if (index >= 0)
            {
                RemoveRow(index);
            }
            return;
        }

        if (index >= 0)
        {
            Rows[index] = (canonicalKey, value);
        }
        else
        {
            Rows.Add((canonicalKey, value));
        }

        NotifyChanged();
    }

    /// <summary>Retypes a free-form row's key, canonicalizing it to a known key's casing if it matches one.</summary>
    protected void HandleFreeKeyChanged(int index, string value)
    {
        Rows[index] = (CanonicalizeKey(value), Rows[index].Value);
        NotifyChanged();
    }

    /// <summary>Updates a free-form row's value.</summary>
    protected void HandleFreeValueChanged(int index, string value)
    {
        Rows[index] = (Rows[index].Key, value);
        NotifyChanged();
    }

    private string CanonicalizeKey(string typedKey)
    {
        foreach (var key in AllKnownKeys)
        {
            if (string.Equals(key, typedKey, StringComparison.OrdinalIgnoreCase))
            {
                return key;
            }
        }

        return typedKey;
    }
}
