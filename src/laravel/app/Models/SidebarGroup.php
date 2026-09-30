<?php

namespace App\Models;

use App\Content\Locale;
use App\Models\Concerns\AssignsNextOrder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SidebarGroup extends Model
{
    use AssignsNextOrder, HasFactory;

    protected $fillable = ['key', 'order', 'active'];

    protected $casts = ['active' => 'boolean'];

    public function translations(): HasMany
    {
        return $this->hasMany(SidebarGroupTranslation::class);
    }

    public function navItems(): HasMany
    {
        return $this->hasMany(NavItem::class);
    }

    public function translation(?string $locale = null): ?SidebarGroupTranslation
    {
        $normalized = Locale::normalize($locale);
        $translations = $this->relationLoaded('translations')
            ? $this->translations
            : $this->translations()->get();

        $translation = $translations->firstWhere('locale', $normalized)
            ?? $translations->firstWhere('locale', 'en');

        return $translation instanceof SidebarGroupTranslation ? $translation : null;
    }
}
