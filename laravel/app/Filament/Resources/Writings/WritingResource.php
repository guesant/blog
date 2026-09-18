<?php

namespace App\Filament\Resources\Writings;

use App\Filament\Resources\Writings\Pages\CreateWriting;
use App\Filament\Resources\Writings\Pages\EditWriting;
use App\Filament\Resources\Writings\Pages\ListWritings;
use App\Filament\Resources\Writings\Schemas\WritingForm;
use App\Filament\Resources\Writings\Tables\WritingsTable;
use App\Models\Writing;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WritingResource extends Resource
{
    protected static ?string $model = Writing::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPencilSquare;

    public static function form(Schema $schema): Schema
    {
        return WritingForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WritingsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListWritings::route('/'),
            'create' => CreateWriting::route('/create'),
            'edit' => EditWriting::route('/{record}/edit'),
        ];
    }
}
