<?php

namespace Tests\Feature\Filament;

use App\Filament\Resources\Pages\Schemas\PageForm;
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
}
