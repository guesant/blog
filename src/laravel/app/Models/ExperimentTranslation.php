<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExperimentTranslation extends Model
{
    use Auditable, HasFactory;

    protected $fillable = ['experiment_id', 'locale', 'name', 'purpose', 'body', 'seo'];

    protected $casts = ['seo' => 'array'];

    /**
     * @return BelongsTo<Experiment, $this>
     */
    public function experiment(): BelongsTo
    {
        return $this->belongsTo(Experiment::class);
    }
}
