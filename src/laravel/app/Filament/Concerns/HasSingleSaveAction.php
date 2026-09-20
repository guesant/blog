<?php

namespace App\Filament\Concerns;

use Filament\Actions\Action;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Schema;

/**
 * Body of a Filament settings page whose form has a single "Save" submit
 * button and nothing else in the footer. Apply to Page classes that define
 * form() and a save() method.
 */
trait HasSingleSaveAction
{
    public function content(Schema $schema): Schema
    {
        return $schema->components([
            Form::make([EmbeddedSchema::make('form')])
                ->id('form')
                ->livewireSubmitHandler('save')
                ->footer([
                    Actions::make([
                        Action::make('save')->submit('save'),
                    ]),
                ]),
        ]);
    }
}
