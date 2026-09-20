<?php

namespace App\Filament\Resources\ReferenceCollections;

use App\Filament\Resources\ReferenceCollections\Pages\CreateReferenceCollection;
use App\Filament\Resources\ReferenceCollections\Pages\EditReferenceCollection;
use App\Filament\Resources\ReferenceCollections\Pages\ListReferenceCollections;
use App\Filament\Resources\ReferenceCollections\Schemas\ReferenceCollectionForm;
use App\Filament\Resources\ReferenceCollections\Tables\ReferenceCollectionsTable;
use App\Models\ReferenceCollection;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ReferenceCollectionResource extends Resource
{
    protected static ?string $model = ReferenceCollection::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFolder;

    public static function form(Schema $schema): Schema
    {
        return ReferenceCollectionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ReferenceCollectionsTable::configure($table);
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
            'index' => ListReferenceCollections::route('/'),
            'create' => CreateReferenceCollection::route('/create'),
            'edit' => EditReferenceCollection::route('/{record}/edit'),
        ];
    }
}
