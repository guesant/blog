using System.Collections.Concurrent;
using System.Diagnostics;
using System.Threading.Channels;
using Microsoft.Extensions.Localization;
using Portfolio.Blazor.Core;
using Portfolio.Blazor.Core.Localization;

namespace Portfolio.Blazor;

public interface IResumePdfService
{
    Task<string?> GetBestAvailableAsync(
        string locale,
        CancellationToken cancellationToken = default
    );
}

public sealed partial class ResumePdfGenerationService(
    IPublicSiteContentProvider contentProvider,
    IConfiguration configuration,
    ILogger<ResumePdfGenerationService> logger,
    IStringLocalizer<SharedResource> localizer
) : BackgroundService, IResumePdfService
{
    private readonly Channel<string> _queue = Channel.CreateBounded<string>(
        new BoundedChannelOptions(8)
        {
            FullMode = BoundedChannelFullMode.Wait,
            SingleReader = true,
            SingleWriter = false,
        }
    );
    private readonly ConcurrentDictionary<string, byte> _pending = new(
        StringComparer.OrdinalIgnoreCase
    );
    private readonly string _cacheRoot =
        configuration["PORTFOLIO_RESUME_PDF_ROOT"] ?? "/data/resume-cache";
    private readonly string _legacyRoot =
        configuration["PORTFOLIO_PUBLIC_ASSET_ROOT"] ?? "/data/public";
    private readonly string _tectonicBundle =
        configuration["TECTONIC_BUNDLE"]
        ?? "https://data1.fullyjustified.net/tlextras-2022.0r0.tar";
    private readonly string _tectonicPath = configuration["TECTONIC_PATH"] ?? "tectonic";
    private readonly bool _tectonicOnlyCached =
        bool.TryParse(configuration["TECTONIC_ONLY_CACHED"], out var onlyCached) && onlyCached;

    public async Task<string?> GetBestAvailableAsync(
        string locale,
        CancellationToken cancellationToken = default
    )
    {
        locale = CultureCatalog.NormalizeName(locale);
        var snapshot = await contentProvider.GetAsync(locale, cancellationToken);
        if (snapshot is null)
            return ExistingPath(locale);
        var hash = ResumePdfDocumentBuilder.ComputeContentHash(snapshot, locale);
        var output = Path.Combine(_cacheRoot, $"resume-{locale}.pdf");
        var marker = output + ".sha256";
        if (
            File.Exists(output)
            && File.Exists(marker)
            && string.Equals(
                (await File.ReadAllTextAsync(marker, cancellationToken)).Trim(),
                hash,
                StringComparison.OrdinalIgnoreCase
            )
        )
            return output;
        Enqueue(locale);
        return File.Exists(output) ? output : ExistingLegacyPath(locale);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
        }
        catch (OperationCanceledException)
        {
            return;
        }
        Enqueue("en");
        Enqueue("pt-BR");
        await foreach (var locale in _queue.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                await GenerateAsync(locale, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                LogResumePdfGenerationFailed(logger, exception, locale);
            }
            finally
            {
                _pending.TryRemove(locale, out _);
            }
        }
    }

    private void Enqueue(string locale)
    {
        if (_pending.TryAdd(locale, 0) && !_queue.Writer.TryWrite(locale))
        {
            _pending.TryRemove(locale, out _);
        }
    }

    private async Task GenerateAsync(string locale, CancellationToken cancellationToken)
    {
        var snapshot =
            await contentProvider.GetAsync(locale, cancellationToken)
            ?? throw new InvalidOperationException(
                "Cannot generate résumé PDF without public content."
            );
        var hash = ResumePdfDocumentBuilder.ComputeContentHash(snapshot, locale);
        var work = Path.Combine(
            Path.GetTempPath(),
            "portfolio-resume-pdf",
            Guid.NewGuid().ToString("N")
        );
        Directory.CreateDirectory(work);
        Directory.CreateDirectory(_cacheRoot);
        var tex = Path.Combine(work, $"resume-{locale}.tex");
        await File.WriteAllTextAsync(
            tex,
            ResumePdfDocumentBuilder.Build(snapshot, locale, key => localizer[key].Value),
            cancellationToken
        );
        var psi = new ProcessStartInfo
        {
            FileName = _tectonicPath,
            WorkingDirectory = work,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
        };
        psi.ArgumentList.Add("--bundle");
        psi.ArgumentList.Add(_tectonicBundle);
        psi.ArgumentList.Add("--outdir");
        psi.ArgumentList.Add(work);
        psi.ArgumentList.Add(tex);
        if (_tectonicOnlyCached)
            psi.ArgumentList.Insert(0, "--only-cached");
        using var process =
            Process.Start(psi) ?? throw new InvalidOperationException("Could not start Tectonic.");
        var errorOutput = process.StandardError.ReadToEndAsync(cancellationToken);
        using var generationTimeout = CancellationTokenSource.CreateLinkedTokenSource(
            cancellationToken
        );
        generationTimeout.CancelAfter(TimeSpan.FromMinutes(5));
        try
        {
            await process.WaitForExitAsync(generationTimeout.Token);
        }
        catch
        {
            if (!process.HasExited)
                process.Kill(entireProcessTree: true);
            throw;
        }
        var error = await errorOutput;
        if (process.ExitCode != 0)
            throw new InvalidOperationException(error.Trim());
        var generated = Path.Combine(work, $"resume-{locale}.pdf");
        if (!File.Exists(generated))
            throw new FileNotFoundException("Tectonic did not produce a PDF.", generated);
        var destination = Path.Combine(_cacheRoot, $"resume-{locale}.pdf");
        var temporaryDestination = destination + ".new";
        File.Copy(generated, temporaryDestination, true);
        File.Move(temporaryDestination, destination, true);
        var temporaryMarker = destination + ".sha256.new";
        await File.WriteAllTextAsync(temporaryMarker, hash, cancellationToken);
        File.Move(temporaryMarker, destination + ".sha256", true);
        Directory.Delete(work, true);
    }

    private string? ExistingPath(string locale) =>
        File.Exists(Path.Combine(_cacheRoot, $"resume-{locale}.pdf"))
            ? Path.Combine(_cacheRoot, $"resume-{locale}.pdf")
            : ExistingLegacyPath(locale);

    private string? ExistingLegacyPath(string locale)
    {
        var path = Path.Combine(_legacyRoot, $"resume-{locale}.pdf");
        return File.Exists(path) ? path : null;
    }

    [LoggerMessage(
        EventId = 1001,
        Level = LogLevel.Error,
        Message = "Résumé PDF generation failed for {Locale}."
    )]
    private static partial void LogResumePdfGenerationFailed(
        ILogger logger,
        Exception exception,
        string locale
    );
}
