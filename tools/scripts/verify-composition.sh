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
        */Portfolio/Portfolio.Blazor.UI/* | */Portfolio/Portfolio.Blazor.Stories/*) continue ;;
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

raw_tags="$(collect_matches '<(div|span|p|h[1-6]|ul|ol|li|table|thead|tbody|tr|th|td|section|article|aside|header|footer|nav|form|input|button|select|textarea|label|a|img|svg|dl|dt|dd|details|summary|strong|small)\b')"
raw_class="$(collect_matches 'class="')"
hidden="$(hidden_render_logic)"

matches="$(printf '%s\n%s\n%s\n' "$raw_tags" "$raw_class" "$hidden" | grep -v '^$' || true)"

if [ -n "$matches" ]; then
    fail "raw structural markup, loose class attribute, or MarkupString/RenderFragment in @code found outside Portfolio/Portfolio.Blazor.UI/Portfolio/Portfolio.Blazor.Stories:
$matches"
fi

echo "Composition checks passed"
