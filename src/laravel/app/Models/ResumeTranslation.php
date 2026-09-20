<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResumeTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['resume_id', 'locale', 'summary', 'leadership', 'education', 'certificates', 'certifications', 'publications', 'recommendations', 'technical_productions', 'events', 'awards'];

    protected $casts = ['leadership' => 'array', 'education' => 'array', 'certificates' => 'array', 'certifications' => 'array', 'publications' => 'array', 'recommendations' => 'array', 'technical_productions' => 'array', 'events' => 'array', 'awards' => 'array'];

    /**
     * @return BelongsTo<Resume, $this>
     */
    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }
}
