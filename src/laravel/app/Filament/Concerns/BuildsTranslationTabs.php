<?php

namespace App\Filament\Concerns;

use Closure;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

/**
 * Every translatable entity in this app stores its translations as
 * separate rows in a `{entity}_translations` table (locale = 'en' or
 * 'pt-BR'), not as a single JSON column — so Filament's form state needs
 * a `translations.en.*` / `translations.pt-BR.*` shape that doesn't map
 * directly to any Eloquent attribute. This trait builds the two-tab UI;
 * SyncsTranslations (on the Create/Edit pages) handles moving that form
 * state in and out of the actual translations relation.
 */
trait BuildsTranslationTabs
{
    /**
     * @param  Closure(string $prefix): array  $fieldsFactory  Given a dot-notation
     *                                                         prefix ('translations.en.' or 'translations.pt-BR.'), must return the
     *                                                         array of form components for that locale, with names built as
     *                                                         "{$prefix}{field}".
     */
    protected static function translationTabs(Closure $fieldsFactory): Tabs
    {
        return Tabs::make('translations')
            ->tabs([
                Tab::make('English')
                    ->schema(static::translationTabSchema($fieldsFactory('translations.en.'))),
                Tab::make('Português')
                    ->schema(static::translationTabSchema($fieldsFactory('translations.pt-BR.'))),
            ])
            ->columnSpanFull();
    }

    private static function translationTabSchema(array $components): array
    {
        $content = array_values(array_filter(
            $components,
            static fn (mixed $component): bool => ! $component instanceof Fieldset,
        ));
        $fieldsets = array_values(array_filter(
            $components,
            static fn (mixed $component): bool => $component instanceof Fieldset,
        ));

        return [
            ...($content === [] ? [] : [
                Section::make('Content')
                    ->schema($content)
                    ->columnSpanFull(),
            ]),
            ...$fieldsets,
        ];
    }
}
