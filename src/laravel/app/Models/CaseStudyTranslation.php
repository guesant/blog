<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CaseStudyTranslation extends Model
{
    use Auditable, HasFactory;

    protected $fillable = ['case_study_id', 'locale', 'title', 'status', 'meta', 'summary', 'context', 'role', 'result', 'body'];

    /**
     * @return BelongsTo<CaseStudy, $this>
     */
    public function caseStudy(): BelongsTo
    {
        return $this->belongsTo(CaseStudy::class);
    }
}
