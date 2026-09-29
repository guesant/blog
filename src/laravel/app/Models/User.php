<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'oidc_issuer', 'oidc_subject'])]
#[Hidden(['password', 'remember_token', 'oidc_issuer', 'oidc_subject'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->canAccessAdminArea();
    }

    public function canAccessAdminArea(): bool
    {
        $expiresAt = session()->get('admin_oidc_expires_at');

        return session()->get('admin_oidc_authorized') === true
            && is_numeric($expiresAt)
            && (int) $expiresAt > now()->timestamp
            && session()->get('admin_oidc_issuer') === rtrim((string) config('services.keycloak.base_url'), '/')
            && session()->get('admin_oidc_subject') === $this->oidc_subject;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
