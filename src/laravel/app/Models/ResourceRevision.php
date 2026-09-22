<?php

namespace App\Models;

use App\Content\Locale;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResourceRevision extends Model
{
    protected $table = 'resource_revisions';

    protected $guarded = [];

    protected $casts = [
        'hidden' => 'boolean',
        'published_date_iso' => 'date',
        'found_date_iso' => 'date',
        'featured' => 'boolean',
        'popularity_rank' => 'float',
        'popularity_value' => 'integer',
    ];

    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ResourceRevisionTranslation::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(ResourceRevisionLink::class);
    }

    public function identifiers(): HasMany
    {
        return $this->hasMany(ResourceRevisionIdentifier::class);
    }

    public function typeDetailRows(): HasMany
    {
        return $this->hasMany(ResourceRevisionTypeDetail::class);
    }

    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class, 'resource_revision_topics', 'resource_revision_id', 'topic_id')
            ->withPivot('role');
    }

    public function translation(?string $locale = null): ?ResourceRevisionTranslation
    {
        $normalized = Locale::normalize($locale);

        return $this->translations->firstWhere('locale', $normalized)
            ?? $this->translations->firstWhere('locale', 'en');
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->whereHas('resource', function (Builder $resource): void {
            $resource->whereColumn('resources.published_revision_id', 'resource_revisions.id');
        })->where('hidden', false)->where('visibility', 'public');
    }

    public function getAuthorsAttribute(): string
    {
        return $this->attributionNames('person');
    }

    public function getOrganizationsAttribute(): string
    {
        return $this->attributionNames('organization');
    }

    private function attributionNames(string $kind): string
    {
        $attributions = $this->relationLoaded('attributions')
            ? $this->attributions
            : $this->attributions()->get();

        return $attributions->where('kind', $kind)->pluck('name')->implode(', ');
    }

    public function attributions(): HasMany
    {
        return $this->hasMany(ResourceRevisionAttribution::class);
    }

    public function getTypeDetailsAttribute(): ?array
    {
        $details = $this->typeDetailRows->first();

        if ($details === null) {
            return null;
        }

        return array_filter([
            'channel' => $details->channel,
            'conference' => $details->conference,
            'duration' => $details->duration,
            'edition' => $details->edition,
            'isbn' => $details->isbn,
            'language' => $details->language,
            'license' => $details->license,
            'name' => $details->name,
            'org' => $details->organization,
            'pages' => $details->pages,
            'publisher' => $details->publisher,
            'year' => $details->year,
            'youtubeId' => $details->youtube_id,
        ], static fn (mixed $value): bool => $value !== null && $value !== '');
    }
}
