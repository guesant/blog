<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTranslation extends Model
{
    use Auditable, HasFactory;

    protected $fillable = ['project_id', 'locale', 'name', 'purpose', 'problem', 'current_focus', 'status', 'metrics', 'body', 'seo'];

    protected $casts = ['metrics' => 'array', 'seo' => 'array'];

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
