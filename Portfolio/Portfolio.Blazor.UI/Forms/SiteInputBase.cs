using Microsoft.AspNetCore.Components;
using Portfolio.Blazor.UI.Foundations;

namespace Portfolio.Blazor.UI.Forms;

/// <summary>Shared plumbing for form inputs: id, name, class merging and attribute splatting.</summary>
public abstract class SiteInputBase : ComponentBase
{
    /// <summary>Explicit id; falls back to the cascaded field context.</summary>
    [Parameter]
    public string? Id { get; set; }

    /// <summary>Form field name submitted with the request.</summary>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>Unmatched attributes splatted onto the rendered element.</summary>
    [Parameter(CaptureUnmatchedValues = true)]
    public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }

    /// <summary>Extra CSS classes to merge onto the rendered element, alongside <see cref="BaseInputClass"/>.</summary>
    [Parameter]
    public string? Class { get; set; }

    /// <summary>Field context cascaded by SiteField, supplying id and aria wiring.</summary>
    [CascadingParameter]
    protected SiteFieldContext? FieldContext { get; set; }

    /// <summary>The id actually rendered: the explicit one, else the field context's.</summary>
    protected string? ResolvedId => Id ?? FieldContext?.Id;

    /// <summary>Base class applied when the caller's own class doesn't already include it.</summary>
    protected virtual string BaseInputClass => "form-control";

    /// <summary>Final class attribute, merging the base class, splatted class and Class.</summary>
    protected string InputClass
    {
        get
        {
            var merged =
                string.IsNullOrWhiteSpace(CapturedClass)
                || !CapturedClass.Contains(BaseInputClass, StringComparison.OrdinalIgnoreCase)
                    ? $"{BaseInputClass} {CapturedClass}".Trim()
                    : CapturedClass;
            return SiteCss.Join(merged, Class);
        }
    }

    /// <summary>The class value arriving through splatted attributes, if any.</summary>
    protected string CapturedClass =>
        AdditionalAttributes
            ?.FirstOrDefault(attribute =>
                attribute.Key.Equals("class", StringComparison.OrdinalIgnoreCase)
            )
            .Value?.ToString()
        ?? string.Empty;

    /// <summary>Attribute keys the subclass already renders explicitly, so they are excluded from <see cref="ForwardedAttributes"/>.</summary>
    protected virtual IReadOnlySet<string> ExcludedAttributeKeys { get; } =
        new HashSet<string>(StringComparer.OrdinalIgnoreCase) { "class", "id", "name" };

    /// <summary>Splatted attributes minus the ones the subclass renders itself.</summary>
    protected IReadOnlyDictionary<string, object> ForwardedAttributes =>
        AdditionalAttributes is null
            ? new Dictionary<string, object>()
            : AdditionalAttributes
                .Where(attribute => !ExcludedAttributeKeys.Contains(attribute.Key))
                .ToDictionary(attribute => attribute.Key, attribute => attribute.Value);
}
