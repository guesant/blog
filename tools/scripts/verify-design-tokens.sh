#!/usr/bin/env sh
set -eu

fail() {
    echo "Design tokens check failed: $1" >&2
    exit 1
}

targets="Portfolio/Portfolio.Blazor.UI Portfolio/Portfolio.Blazor.Client Portfolio/Portfolio.Blazor/Components Portfolio/Portfolio.Blazor/wwwroot/app.css"

matches="$(grep -REn --binary-files=without-match \
    --exclude-dir=bin --exclude-dir=obj \
    '(#[0-9a-fA-F]{3,8}\b|\b[0-9.]+px\b|style=")' $targets 2>/dev/null |
    grep -vE '/(tokens|fonts)\.css([:/]|$)' |
    grep -vE '(^|/)vendor/' |
    grep -vE 'name="theme-color"' |
    grep -vE ':[0-9]+:[[:space:]]*///' |
    grep -vE '/SiteGrid\.razor:.*style="@RootStyle"' |
    grep -vE '/SitePreviewBox\.razor:.*style="@Style"' |
    grep -vE '/(PasswordGenerator|CssGradientGenerator|CssClampCalculator|CssBorderRadiusGenerator|CssBoxShadowGenerator|RandomColorPalette|ColorConverter|ContrastChecker)\.razor(\.cs)?:' || true)"

if [ -n "$matches" ]; then
    fail "raw hex color, px value, or inline style found outside token files:
$matches"
fi

echo "Design tokens checks passed"
