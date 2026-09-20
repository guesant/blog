<?php

namespace Tests\Feature\Models;

use App\Models\CreditEntry;
use App\Models\CreditEntryTranslation;
use Tests\TestCase;

class CreditEntryTest extends TestCase
{
    public function test_can_create_credit_entry(): void
    {
        $entry = CreditEntry::factory()->create();

        $this->assertInstanceOf(CreditEntry::class, $entry);
        $this->assertNotNull($entry->id);
    }

    public function test_credit_entry_has_translations(): void
    {
        $entry = CreditEntry::factory()->create();
        CreditEntryTranslation::factory()->create(['credit_entry_id' => $entry->id]);

        $this->assertCount(1, $entry->translations);
        $this->assertInstanceOf(CreditEntryTranslation::class, $entry->translations->first());
    }
}
