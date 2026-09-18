<?php

namespace App\Filament\Resources\CreditEntries;

use App\Filament\Resources\CreditEntries\Pages\CreateCreditEntry;
use App\Filament\Resources\CreditEntries\Pages\EditCreditEntry;
use App\Filament\Resources\CreditEntries\Pages\ListCreditEntries;
use App\Filament\Resources\CreditEntries\Schemas\CreditEntryForm;
use App\Filament\Resources\CreditEntries\Tables\CreditEntriesTable;
use App\Models\CreditEntry;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CreditEntryResource extends Resource
{
    protected static ?string $model = CreditEntry::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHeart;

    protected static ?string $navigationLabel = 'Credits';

    protected static ?string $modelLabel = 'Credit';

    public static function form(Schema $schema): Schema
    {
        return CreditEntryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CreditEntriesTable::configure($table);
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
            'index' => ListCreditEntries::route('/'),
            'create' => CreateCreditEntry::route('/create'),
            'edit' => EditCreditEntry::route('/{record}/edit'),
        ];
    }
}
