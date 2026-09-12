export function getUserAgent() {
    return navigator.userAgent;
}

export function getViewport() {
    return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        pixelRatio: window.devicePixelRatio,
        colorDepth: window.screen.colorDepth,
        language: navigator.language,
        languages: navigator.languages?.join(", ") || navigator.language,
    };
}
