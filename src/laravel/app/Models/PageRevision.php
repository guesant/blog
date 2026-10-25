<?php

namespace App\Models;

use App\Content\Locale;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PageRevision extends Model
{
    protected $table = 'page_revisions';

    protected $guarded = [];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(PageRevisionTranslation::class);
    }

    public function homeSections(): HasMany
    {
        return $this->hasMany(PageRevisionHomeSection::class)->orderBy('sort_order');
    }

    public function translation(?string $locale = null): ?PageRevisionTranslation
    {
        $normalized = Locale::normalize($locale);

        return $this->translations->firstWhere('locale', $normalized)
            ?? $this->translations->firstWhere('locale', 'en');
    }

    /**
     * @return BelongsToMany<Writing, $this, Pivot, 'pivot'>
     */
    public function featuredWritings(): BelongsToMany
    {
        return $this->belongsToMany(Writing::class, 'page_revision_featured_writings', 'page_revision_id', 'writing_id')
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }
}
