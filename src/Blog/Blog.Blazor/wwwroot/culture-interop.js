window.blazorCulture = (() => {
    function get() {
        const match = document.cookie.match(/(?:^|;\s*)\.AspNetCore\.Culture=([^;]+)/);
        if (!match) return null;
        const value = decodeURIComponent(match[1]);
        const cultureMatch = value.match(/(?:^|\|)c=([^|]+)/);
        return cultureMatch ? cultureMatch[1] : null;
    }

    return { get };
})();
