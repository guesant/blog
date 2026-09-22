<?php

namespace App\Models;

use App\Content\Graph\GraphNode;
use App\Content\Graph\InteractsWithGraph;
use App\Content\Locale;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method SnippetTranslation|null translation(?string $locale = null)
 */
class Snippet extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, HasTranslations, InteractsWithGraph, UsesCurrentRevision {
        UsesCurrentRevision::translation insteadof HasTranslations;
        HasTranslations::translation as legacyTranslation;
    }

    protected $fillable = ['slug', 'public_id', 'hidden', 'show_history', 'order', 'published_at'];

    protected $casts = ['hidden' => 'boolean', 'show_history' => 'boolean', 'published_at' => 'date'];

    /**
     * @return HasMany<SnippetTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(SnippetTranslation::class);
    }

    /**
     * @return HasMany<SnippetFile, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(SnippetFile::class)->orderBy('order');
    }

    /**
     * Nests files by their path's directory segments into
     * ['dirs' => ['name' => <tree>], 'files' => [SnippetFile, ...]] so the
     * file-tree view can render folders without knowing the paths upfront.
     */
    public function fileTree(): array
    {
        /** @var array{dirs: array<string, mixed>, files: array<int, array{name: string, file: SnippetFile}>} $tree */
        $tree = ['dirs' => [], 'files' => []];

        foreach ($this->files as $file) {
            $segments = explode('/', trim($file->path, '/'));
            $filename = array_pop($segments);
            $cursor = &$tree;

            foreach ($segments as $segment) {
                if (! isset($cursor['dirs'][$segment])) {
                    $cursor['dirs'][$segment] = ['dirs' => [], 'files' => []];
                }
                $cursor = &$cursor['dirs'][$segment];
            }

            $cursor['files'][] = ['name' => $filename, 'file' => $file];
            unset($cursor);
        }

        return $tree;
    }

    public static function graphKind(): string
    {
        return 'snippet';
    }

    public static function graphNodesQuery(): Builder
    {
        return static::query()->where('hidden', false)->with('translations');
    }

    public function graphLabel(string $locale): string
    {
        return $this->translation($locale)->title ?? $this->slug;
    }

    public function graphUrl(string $locale): ?string
    {
        return Locale::url("/snippets/{$this->slug}", $locale);
    }
}
