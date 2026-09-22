<?php

namespace Tests\Feature\Models;

use App\Models\CreditEntry;
use App\Models\CreditEntryRevisionTranslation;
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
        CreditEntryRevisionTranslation::factory()->create(['credit_entry_id' => $entry->id]);
        $entry->refresh();

        $this->assertCount(1, $entry->translations);
        $this->assertInstanceOf(CreditEntryRevisionTranslation::class, $entry->translations->first());
    }
}
