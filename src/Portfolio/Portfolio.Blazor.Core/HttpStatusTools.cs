namespace Portfolio.Blazor.Core;

public sealed record HttpStatusEntry(int Code, string Name, string Description)
{
    public string SearchText => $"{Code} {Name} {Description}";
}

public static class HttpStatusReference
{
    public static IReadOnlyList<HttpStatusEntry> All { get; } =
    [
        new(
            100,
            "Continue",
            "The server has received the request headers and the client should proceed to send the request body."
        ),
        new(
            101,
            "Switching Protocols",
            "The requester has asked the server to switch protocols and the server has agreed."
        ),
        new(
            102,
            "Processing",
            "The server has received and is processing the request, but no response is available yet."
        ),
        new(
            103,
            "Early Hints",
            "Used to return some response headers before the final HTTP message."
        ),
        new(200, "OK", "The request has succeeded."),
        new(
            201,
            "Created",
            "The request has succeeded and a new resource has been created as a result."
        ),
        new(202, "Accepted", "The request has been received but not yet acted upon."),
        new(
            203,
            "Non-Authoritative Information",
            "The returned metadata is not exactly the same as available from the origin server."
        ),
        new(
            204,
            "No Content",
            "There is no content to send for this request, but the headers are useful."
        ),
        new(205, "Reset Content", "Tells the requester to reset the document view."),
        new(
            206,
            "Partial Content",
            "Used when the client has requested a range of the resource with a Range header."
        ),
        new(
            207,
            "Multi-Status",
            "Conveys information about multiple resources in situations where multiple status codes might be appropriate."
        ),
        new(
            208,
            "Already Reported",
            "The members of a DAV binding have already been enumerated in a previous reply."
        ),
        new(
            226,
            "IM Used",
            "The server has fulfilled a request for the resource, and the response is a representation of the result of instance manipulations."
        ),
        new(
            300,
            "Multiple Choices",
            "The request has more than one possible response, and the client should choose one."
        ),
        new(
            301,
            "Moved Permanently",
            "The resource has been moved permanently to a new URL, given in the response."
        ),
        new(302, "Found", "The resource resides temporarily under a different URL."),
        new(
            303,
            "See Other",
            "The response can be found under a different URL using a GET method."
        ),
        new(
            304,
            "Not Modified",
            "Indicates that the resource has not been modified since the version specified in the request headers."
        ),
        new(
            305,
            "Use Proxy",
            "The requested resource must be accessed through the proxy given in the response."
        ),
        new(
            307,
            "Temporary Redirect",
            "The request should be repeated with another URL, but future requests should still use the original URL."
        ),
        new(
            308,
            "Permanent Redirect",
            "The resource has been moved permanently, and future requests should use the new URL."
        ),
        new(
            400,
            "Bad Request",
            "The server cannot process the request due to a client error, such as malformed syntax."
        ),
        new(
            401,
            "Unauthorized",
            "The client must authenticate itself to get the requested response."
        ),
        new(
            402,
            "Payment Required",
            "Reserved for future use, originally intended for digital payment systems."
        ),
        new(
            403,
            "Forbidden",
            "The client does not have access rights to the content, so the server refuses to give it."
        ),
        new(404, "Not Found", "The server cannot find the requested resource."),
        new(
            405,
            "Method Not Allowed",
            "The request method is known by the server but is not supported for this resource."
        ),
        new(
            406,
            "Not Acceptable",
            "The server cannot produce a response matching the list of acceptable values in the request."
        ),
        new(
            407,
            "Proxy Authentication Required",
            "The client must first authenticate itself with the proxy."
        ),
        new(408, "Request Timeout", "The server timed out waiting for the request."),
        new(
            409,
            "Conflict",
            "The request conflicts with the current state of the target resource."
        ),
        new(
            410,
            "Gone",
            "The requested content has been permanently deleted and no forwarding address is known."
        ),
        new(
            411,
            "Length Required",
            "The server refuses to accept the request without a defined Content-Length header."
        ),
        new(
            412,
            "Precondition Failed",
            "One or more conditions given in the request header fields evaluated to false."
        ),
        new(
            413,
            "Payload Too Large",
            "The request entity is larger than limits defined by the server."
        ),
        new(
            414,
            "URI Too Long",
            "The URI requested by the client is longer than the server is willing to interpret."
        ),
        new(
            415,
            "Unsupported Media Type",
            "The media format of the requested data is not supported by the server."
        ),
        new(
            416,
            "Range Not Satisfiable",
            "The range specified by the Range header field cannot be fulfilled."
        ),
        new(
            417,
            "Expectation Failed",
            "The expectation given in the request Expect header could not be met."
        ),
        new(
            418,
            "I'm a teapot",
            "The server refuses to brew coffee because it is, permanently, a teapot."
        ),
        new(
            421,
            "Misdirected Request",
            "The request was directed at a server that is not able to produce a response."
        ),
        new(
            422,
            "Unprocessable Entity",
            "The request was well-formed but contains semantic errors that prevent processing."
        ),
        new(423, "Locked", "The resource that is being accessed is locked."),
        new(
            424,
            "Failed Dependency",
            "The request failed because it depended on another request that failed."
        ),
        new(
            425,
            "Too Early",
            "The server is unwilling to risk processing a request that might be replayed."
        ),
        new(
            426,
            "Upgrade Required",
            "The client should switch to a different protocol given in the Upgrade header field."
        ),
        new(
            428,
            "Precondition Required",
            "The origin server requires the request to be conditional."
        ),
        new(
            429,
            "Too Many Requests",
            "The user has sent too many requests in a given amount of time (rate limiting)."
        ),
        new(
            431,
            "Request Header Fields Too Large",
            "The server is unwilling to process the request because its header fields are too large."
        ),
        new(
            451,
            "Unavailable For Legal Reasons",
            "The user requested a resource that is unavailable for legal reasons, such as government censorship."
        ),
        new(
            500,
            "Internal Server Error",
            "The server has encountered a situation it does not know how to handle."
        ),
        new(
            501,
            "Not Implemented",
            "The request method is not supported by the server and cannot be handled."
        ),
        new(
            502,
            "Bad Gateway",
            "The server, while acting as a gateway, got an invalid response from the upstream server."
        ),
        new(
            503,
            "Service Unavailable",
            "The server is not ready to handle the request, often due to maintenance or overload."
        ),
        new(
            504,
            "Gateway Timeout",
            "The server, while acting as a gateway, did not get a response in time from the upstream server."
        ),
        new(
            505,
            "HTTP Version Not Supported",
            "The HTTP version used in the request is not supported by the server."
        ),
        new(
            506,
            "Variant Also Negotiates",
            "The server has an internal configuration error: the chosen variant resource is configured to engage in content negotiation itself."
        ),
        new(
            507,
            "Insufficient Storage",
            "The method could not be performed because the server is unable to store the representation needed."
        ),
        new(
            508,
            "Loop Detected",
            "The server detected an infinite loop while processing the request."
        ),
        new(
            510,
            "Not Extended",
            "Further extensions to the request are required for the server to fulfill it."
        ),
        new(
            511,
            "Network Authentication Required",
            "The client needs to authenticate to gain network access."
        ),
    ];

    public static IReadOnlyList<HttpStatusEntry> Filter(string? query)
    {
        var normalized = query?.Trim() ?? string.Empty;
        return string.IsNullOrEmpty(normalized)
            ? All
            : All.Where(status =>
                    status.SearchText.Contains(normalized, StringComparison.OrdinalIgnoreCase)
                )
                .ToArray();
    }
}
