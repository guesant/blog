namespace Blog.Blazor.UI.Forms;

public partial class SiteKeyValueInput
{
    [Parameter]
    public string? Id { get; set; }

    private void HandleKeyChanged(int index, string value)
    {
        Rows[index] = (value, Rows[index].Value);
        NotifyChanged();
    }

    private void HandleValueChanged(int index, string value)
    {
        Rows[index] = (Rows[index].Key, value);
        NotifyChanged();
    }
}
