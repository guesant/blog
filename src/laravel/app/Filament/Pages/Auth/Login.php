<?php

namespace App\Filament\Pages\Auth;

use Filament\Auth\Pages\Login as BaseLogin;
use Filament\Schemas\Schema;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\HtmlString;

class Login extends BaseLogin
{
    protected array $extraBodyAttributes = [
        'class' => 'portfolio-admin-login',
    ];

    public function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }

    protected function getFormActions(): array
    {
        return [];
    }

    public function getSubheading(): string|Htmlable|null
    {
        return new HtmlString(sprintf(
            '<a href="%s">Entrar com Keycloak</a>',
            e(route('auth.keycloak.redirect')),
        ));
    }
}
