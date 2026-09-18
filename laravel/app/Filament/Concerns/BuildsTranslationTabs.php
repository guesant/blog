<?php

namespace App\Filament\Concerns;

use Closure;
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
                    ->schema($fieldsFactory('translations.en.')),
                Tab::make('Português')
                    ->schema($fieldsFactory('translations.pt-BR.')),
            ])
            ->columnSpanFull();
    }
}
