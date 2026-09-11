using QRCoder;

namespace Portfolio.Blazor.Core;

public sealed record QrCodeResult(bool IsValid, string Svg)
{
    public static QrCodeResult Empty => new(false, string.Empty);
}

public static class QrCodeGeneratorEngine
{
    public static QrCodeResult Generate(string? text)
    {
        var value = text?.Trim() ?? string.Empty;
        if (value.Length == 0)
            return QrCodeResult.Empty;
        try
        {
            using var generator = new QRCodeGenerator();
            using var data = generator.CreateQrCode(value, QRCodeGenerator.ECCLevel.M);
            return new(true, new SvgQRCode(data).GetGraphic(4));
        }
        catch (Exception) when (value.Length > 0)
        {
            return QrCodeResult.Empty;
        }
    }
}
