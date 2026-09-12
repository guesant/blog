using System.Net;

if (args.Length < 1)
{
    Console.Error.WriteLine("usage: serve-static.cs <root-dir> [prefix]");
    return 2;
}

var root = Path.GetFullPath(args[0]);
var prefix = args.Length > 1 ? args[1] : "http://+:8081/";

var mimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
{
    [".html"] = "text/html",
    [".htm"] = "text/html",
    [".css"] = "text/css",
    [".js"] = "text/javascript",
    [".mjs"] = "text/javascript",
    [".json"] = "application/json",
    [".wasm"] = "application/wasm",
    [".dat"] = "application/octet-stream",
    [".blat"] = "application/octet-stream",
    [".dll"] = "application/octet-stream",
    [".pdb"] = "application/octet-stream",
    [".woff"] = "font/woff",
    [".woff2"] = "font/woff2",
    [".svg"] = "image/svg+xml",
    [".png"] = "image/png",
    [".ico"] = "image/x-icon",
    [".map"] = "application/json",
    [".xml"] = "application/xml",
};

using var listener = new HttpListener();
listener.Prefixes.Add(prefix);
listener.Start();
Console.WriteLine($"serving {root} on {prefix}");

while (true)
{
    var context = await listener.GetContextAsync();
    _ = Task.Run(async () =>
    {
        try
        {
            var requestPath = context.Request.Url!.AbsolutePath.TrimStart('/');
            if (string.IsNullOrEmpty(requestPath))
            {
                requestPath = "index.html";
            }
            var filePath = Path.GetFullPath(Path.Combine(root, requestPath));
            var isWithinRoot = filePath.StartsWith(root, StringComparison.Ordinal);
            if ((!isWithinRoot || !File.Exists(filePath)) && !Path.HasExtension(requestPath))
            {
                filePath = Path.Combine(root, "index.html");
            }
            if (!File.Exists(filePath))
            {
                context.Response.StatusCode = 404;
                return;
            }
            var extension = Path.GetExtension(filePath);
            context.Response.ContentType = mimeTypes.TryGetValue(extension, out var mimeType)
                ? mimeType
                : "application/octet-stream";
            var bytes = await File.ReadAllBytesAsync(filePath);
            context.Response.ContentLength64 = bytes.Length;
            await context.Response.OutputStream.WriteAsync(bytes);
        }
        catch (Exception exception)
        {
            Console.Error.WriteLine(exception);
            context.Response.StatusCode = 500;
        }
        finally
        {
            context.Response.Close();
        }
    });
}
