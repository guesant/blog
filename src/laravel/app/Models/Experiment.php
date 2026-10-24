<?php

namespace App\Models;

use App\Models\Concerns\AssignsNextOrder;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property bool $show_history
 *
 * @method static \Illuminate\Database\Eloquent\Builder published()
 * @method ExperimentRevisionTranslation|null translation(?string $locale = null)
 */
class Experiment extends Model
{
    use AssignsNextOrder, Auditable, HasFactory, HasPublicId, UsesCurrentRevision;

    protected $fillable = ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'published_at', 'show_history'];

    protected $casts = ['hidden' => 'boolean', 'external' => 'boolean', 'published_at' => 'date', 'show_history' => 'boolean'];

    /**
     * @return BelongsToMany<Technology, $this>
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'experiment_technology')->withPivot('order')->orderByPivot('order');
    }
}
