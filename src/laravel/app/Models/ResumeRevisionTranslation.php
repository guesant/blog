<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ResumeRevisionTranslation extends Model
{
    protected $table = 'resume_revision_translations';

    protected $guarded = [];

    public function getLeadershipAttribute(): array
    {
        return $this->rows('leadership');
    }

    public function getEducationAttribute(): array
    {
        return $this->rows('education');
    }

    public function getCertificatesAttribute(): array
    {
        return $this->rows('certificates');
    }

    public function getCertificationsAttribute(): array
    {
        return $this->rows('certifications');
    }

    public function getPublicationsAttribute(): array
    {
        return $this->rows('publications');
    }

    public function getRecommendationsAttribute(): array
    {
        return $this->rows('recommendations');
    }

    public function getTechnicalProductionsAttribute(): array
    {
        return $this->rows('technical_productions');
    }

    public function getEventsAttribute(): array
    {
        return $this->rows('events');
    }

    public function getAwardsAttribute(): array
    {
        return $this->rows('awards');
    }

    private function rows(string $kind): array
    {
        return DB::table('resume_revision_'.$kind)
            ->where('resume_revision_translation_id', $this->id)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (object $row): array => collect((array) $row)
                ->except(['resume_revision_translation_id', 'sort_order', 'created_at', 'updated_at'])
                ->mapWithKeys(fn (mixed $value, string $key): array => [Str::camel($key) => $value])
                ->all())
            ->all();
    }
}
