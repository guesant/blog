#!/usr/bin/env sh
set -eu

fail() {
    echo "Composition check failed: $1" >&2
    exit 1
}

repo_root="$(cd "$(dirname "$0")/../.." && pwd)"
allowlist="$repo_root/tools/scripts/composition-allowlist.json"

allowlist_flat="$(awk '
    /"file"[[:space:]]*:/ {
        line = $0
        sub(/^[^:]*:[[:space:]]*"/, "", line)
        sub(/"[[:space:]]*,?[[:space:]]*$/, "", line)
        file = line
    }
    /"line-or-pattern"[[:space:]]*:/ {
        line = $0
        sub(/^[^:]*:[[:space:]]*"/, "", line)
        sub(/"[[:space:]]*,?[[:space:]]*$/, "", line)
        print file "\t" line
    }
' "$allowlist" | sed 's/\\"/"/g')"

is_whole_file_allowed() {
    rel="$1"
    printf '%s\n' "$allowlist_flat" | while IFS="$(printf '\t')" read -r pat_file pat_line; do
        [ -z "$pat_file" ] && continue
        [ "$pat_line" = "*" ] || continue
        case "$rel" in
            $pat_file)
                echo yes
                return 0
                ;;
        esac
    done
}

is_line_allowed() {
    rel="$1"
    text="$2"
    printf '%s\n' "$allowlist_flat" | while IFS="$(printf '\t')" read -r pat_file pat_line; do
        [ -z "$pat_file" ] && continue
        case "$rel" in
            $pat_file)
                if [ "$pat_line" = "*" ]; then
                    echo yes
                    return 0
                fi
                case "$text" in
                    *"$pat_line"*)
                        echo yes
                        return 0
                        ;;
                esac
                ;;
        esac
    done
}

all_razor_files="$(find "$repo_root" -type f -name '*.razor' -not -path '*/bin/*' -not -path '*/obj/*')"

native_scope_files=""
for f in $all_razor_files; do
    case "$f" in
        */src/Portfolio/Portfolio.Blazor.UI/* | */src/Portfolio/Portfolio.Blazor.Stories/*) continue ;;
    esac
    native_scope_files="$native_scope_files
$f"
done

target_files=""
for f in $native_scope_files; do
    [ -z "$f" ] && continue
    rel="${f#"$repo_root"/}"
    if [ "$(is_whole_file_allowed "$rel")" = "yes" ]; then
        continue
    fi
    target_files="$target_files
$f"
done

collect_matches() {
    pattern="$1"
    for f in $target_files; do
        [ -z "$f" ] && continue
        rel="${f#"$repo_root"/}"
        grep -Hn --binary-files=without-match -E "$pattern" "$f" 2>/dev/null | while IFS=: read -r _file lineno text; do
            if [ "$(is_line_allowed "$rel" "$text")" = "yes" ]; then
                continue
            fi
            echo "$rel:$lineno:$text"
        done
    done
}

hidden_render_logic() {
    for f in $target_files; do
        [ -z "$f" ] && continue
        rel="${f#"$repo_root"/}"
        awk '
            /^[[:space:]]*@code/ { in_code = 1 }
            in_code && /\<(MarkupString|RenderFragment)\>/ { print FNR ":" $0 }
        ' "$f" | while IFS=: read -r lineno text; do
            if [ "$(is_line_allowed "$rel" "$text")" = "yes" ]; then
                continue
            fi
            echo "$rel:$lineno:$text"
        done
    done
}

raw_tags="$(collect_matches '<(div|span|p|h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|section|article|aside|header|footer|nav|main|form|input|button|select|textarea|label|a|img|svg|dl|dt|dd|details|summary|strong|small)\b')"
raw_class="$(collect_matches 'class="')"
hidden="$(hidden_render_logic)"

matches="$(printf '%s\n%s\n%s\n' "$raw_tags" "$raw_class" "$hidden" | grep -v '^$' || true)"

if [ -n "$matches" ]; then
    fail "raw structural markup, loose class attribute, or MarkupString/RenderFragment in @code found outside src/Portfolio/Portfolio.Blazor.UI/src/Portfolio/Portfolio.Blazor.Stories:
$matches"
fi

client="$repo_root/src/Portfolio/Portfolio.Blazor.Client"
ui="$repo_root/src/Portfolio/Portfolio.Blazor.UI"
home_feed="$client/Shared/ContentFeed.razor"

for page in "$home_feed" "$client"/Pages/Cases.razor "$client"/Pages/Credits.razor "$client"/Pages/Projects.razor "$client"/Pages/Snippets.razor "$client"/Pages/Technologies.razor "$client"/Pages/Topics.razor "$client"/Pages/Tools.razor; do
    grep -Eq '<SiteListingShell\b' "$page" || fail "${page#"$repo_root"/} must render its listing through SiteListingShell"
done
for page in "$home_feed" "$client"/Pages/Topics.razor "$client"/Pages/Snippets.razor "$client"/Pages/Tools.razor; do
    grep -Eq '<FilterContent>' "$page" || fail "${page#"$repo_root"/} must expose its filters through the listing shell"
done
if grep -REn '<Site(ListHeader|Pagination)\b' "$client/Pages" 2>/dev/null; then
    fail "pages must not render list headers or pagination outside SiteListingShell"
fi

renders_site_card() {
    if grep -qE '<Site(Clickable|Feed)Card\b' "$1"; then
        return 0
    fi
    for component in $(grep -oE '<[A-Z][A-Za-z0-9]*' "$1" | tr -d '<' | sort -u); do
        composed="$client/Shared/${component}.razor"
        if [ -f "$composed" ] && grep -qE '<Site(Clickable|Feed)Card\b' "$composed"; then
            return 0
        fi
    done
    return 1
}
for page in "$home_feed" "$client"/Pages/Cases.razor "$client"/Pages/Projects.razor "$client"/Pages/Snippets.razor "$client"/Pages/Technologies.razor "$client"/Pages/Topics.razor "$client"/Pages/Tools.razor; do
    renders_site_card "$page" || fail "${page#"$repo_root"/} must render entity listings through SiteFeedCard or SiteClickableCard"
done

grep -Eq 'href="@Href\(|Href="@Href\(' "$ui/Navigation/SitePagination.razor" ||
    fail "SitePagination must emit real hrefs for progressive navigation"
grep -Eq '^@inherits[[:space:]]+InputBase<string>' "$ui/Forms/SiteSelect.razor" ||
    fail "SiteSelect must integrate with Blazor InputBase validation"
grep -q 'SiteValidationMessage' "$ui/Forms/SiteSelect.razor" ||
    fail "SiteSelect must render the site-owned validation message"
grep -q 'name="@Name"' "$ui/Forms/SiteSelect.razor" ||
    fail "SiteSelect must preserve named values for interactive form POSTs"
if grep -REn '[✉↗→➜➤]' "$client/Shared" --include='*.razor' 2>/dev/null; then
    fail "shared components must use SiteIcon instead of Unicode icon characters"
fi

echo "Composition checks passed"
