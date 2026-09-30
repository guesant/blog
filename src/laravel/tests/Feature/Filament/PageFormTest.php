<?php

namespace Tests\Feature\Filament;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Pages\Schemas\PageForm;
use App\Models\Page;
use App\Models\PageRevisionTranslation;
use Filament\Schemas\Components\Fieldset;
use ReflectionMethod;
use Tests\TestCase;

class PageFormTest extends TestCase
{
    public function test_page_fields_are_grouped_by_page_specific_sections(): void
    {
        $method = new ReflectionMethod(PageForm::class, 'pageFieldInputs');

        $components = $method->invoke(null, 'translations.en.');

        $this->assertNotEmpty($components);
        $this->assertContainsOnlyInstancesOf(Fieldset::class, array_filter(
            $components,
            static fn (mixed $component): bool => $component instanceof Fieldset,
        ));
    }

    public function test_page_fields_do_not_expose_eyebrow_fields(): void
    {
        $this->assertFalse(collect(PageRevisionTranslation::FIELDS)->contains(
            static fn (string $field): bool => $field === 'eyebrow' || str_ends_with($field, '_eyebrow'),
        ));
    }

    public function test_page_translation_data_matches_the_form_state_shape(): void
    {
        $page = Page::factory()->create(['slug' => 'credits']);
        PageRevisionTranslation::factory()->create([
            'page_id' => $page->id,
            'locale' => 'en',
            'title' => 'Credits',
            'description' => 'A personal catalog of references.',
            'hero_identity' => 'Identity',
        ]);
        $page->refresh();

        $subject = new class($page)
        {
            use SyncsTranslations;

            public function __construct(private Page $record) {}

            protected function getRecord(): Page
            {
                return $this->record;
            }

            public function fill(array $data): array
            {
                return $this->fillTranslationsIntoData($data);
            }
        };

        $data = $subject->fill(['slug' => 'credits']);

        $this->assertSame('Credits', $data['translations']['en']['fields']['title']);
        $this->assertSame('A personal catalog of references.', $data['translations']['en']['fields']['description']);
        $this->assertSame('Identity', $data['translations']['en']['fields']['hero_identity']);
        $this->assertArrayNotHasKey('title', $data['translations']['en']);
    }
}
