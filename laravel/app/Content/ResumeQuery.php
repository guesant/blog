<?php

namespace App\Content;

use App\Models\Resume;

class ResumeQuery
{
    public function find(): ?Resume
    {
        return Resume::with([
            'translations',
            'selectedCases' => fn ($q) => $q->where('hidden', false)->where('nda', false),
            'selectedCases.translations',
            'skills.topic.translations',
            'skills.technologies.translations',
            'languages.language.translations',
        ])->first();
    }
}
