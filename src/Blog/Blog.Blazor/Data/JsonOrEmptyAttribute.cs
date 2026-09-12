using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace Blog.Blazor.Data;

public sealed class JsonOrEmptyAttribute()
    : ValidationAttribute("The {0} field must be empty or contain valid JSON.")
{
    public override bool IsValid(object? value)
    {
        if (value is not string text || string.IsNullOrWhiteSpace(text))
            return true;

        try
        {
            using var document = JsonDocument.Parse(text);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }
}
