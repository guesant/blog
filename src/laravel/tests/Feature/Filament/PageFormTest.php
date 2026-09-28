<?php

namespace Tests\Feature\Filament;

use App\Filament\Resources\Pages\Schemas\PageForm;
use Filament\Schemas\Components\Fieldset;
use ReflectionMethod;
use Tests\TestCase;

class PageFormTest extends TestCase
{
    public function test_page_fields_can_be_grouped_by_prefix(): void
    {
        $method = new ReflectionMethod(PageForm::class, 'pageFieldInputs');

        $components = $method->invoke(null, 'translations.en.');

        $this->assertNotEmpty($components);
        $this->assertContainsOnlyInstancesOf(Fieldset::class, array_filter(
            $components,
            static fn (mixed $component): bool => $component instanceof Fieldset,
        ));
    }
}
