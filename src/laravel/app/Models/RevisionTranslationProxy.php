<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevisionTranslationProxy extends Model
{
    protected $table = 'revision_translation_proxies';

    public $timestamps = false;

    protected $guarded = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->exists = true;
    }
}
