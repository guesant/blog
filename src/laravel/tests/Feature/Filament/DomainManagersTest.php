<?php

namespace Tests\Feature\Filament;

use App\Filament\Pages\ManageContact;
use App\Filament\Pages\ManageCredits;
use App\Filament\Pages\ManageFollow;
use App\Filament\Pages\ManageHome;
use App\Filament\Pages\ManagePortfolio;
use App\Filament\Pages\ManageProfile;
use App\Filament\Pages\ManageResume;
use App\Filament\Resources\Pages\PageResource;
use App\Models\Page;
use App\Models\SiteSettings;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Livewire\Livewire;
use Tests\TestCase;

class DomainManagersTest extends TestCase
{
    public function test_domain_managers_render_without_errors(): void
    {
        $this->actingAsAdmin();

        foreach ([
            ManageHome::class,
            ManageProfile::class,
            ManageResume::class,
            ManageContact::class,
            ManageCredits::class,
            ManagePortfolio::class,
            ManageFollow::class,
        ] as $manager) {
            Livewire::test($manager)->assertHasNoErrors();
        }
    }

    public function test_managed_pages_are_not_editable_through_pages_resource(): void
    {
        $this->actingAsAdmin();
        Page::factory()->create(['slug' => 'home']);
        Page::factory()->create(['slug' => 'license']);

        $slugs = PageResource::getEloquentQuery()->pluck('slug')->all();

        $this->assertNotContains('home', $slugs);
        $this->assertContains('license', $slugs);
    }

    public function test_home_portfolio_follow_and_credits_save_localized_page_content(): void
    {
        $this->actingAsAdmin();

        Livewire::test(ManageHome::class)
            ->set('data.translations.en.fields.title', 'Home')
            ->set('data.translations.pt-BR.fields.title', 'Início')
            ->call('save')
            ->assertHasNoErrors();

        Livewire::test(ManagePortfolio::class)
            ->set('data.translations.en.fields.title', 'Portfolio')
            ->set('data.translations.pt-BR.fields.title', 'Portfólio')
            ->call('save')
            ->assertHasNoErrors();

        Livewire::test(ManageFollow::class)
            ->set('data.translations.en.fields.title', 'Follow')
            ->set('data.translations.pt-BR.fields.title', 'Acompanhar')
            ->call('save')
            ->assertHasNoErrors();

        Livewire::test(ManageCredits::class)
            ->set('data.translations.en.fields.title', 'Credits')
            ->set('data.translations.pt-BR.fields.title', 'Créditos')
            ->call('save')
            ->assertHasNoErrors();

        foreach ([
            ['slug' => 'home', 'en' => 'Home', 'pt-BR' => 'Início'],
            ['slug' => 'portfolio', 'en' => 'Portfolio', 'pt-BR' => 'Portfólio'],
            ['slug' => 'follow', 'en' => 'Follow', 'pt-BR' => 'Acompanhar'],
            ['slug' => 'credits', 'en' => 'Credits', 'pt-BR' => 'Créditos'],
        ] as $pageData) {
            $page = Page::query()->where('slug', $pageData['slug'])->firstOrFail();

            $this->assertSame($pageData['en'], $page->currentRevision->translations()->where('locale', 'en')->value('title'));
            $this->assertSame($pageData['pt-BR'], $page->currentRevision->translations()->where('locale', 'pt-BR')->value('title'));
        }
    }

    public function test_profile_and_resume_managers_keep_page_content_in_their_domains(): void
    {
        $this->actingAsAdmin();

        Livewire::test(ManageProfile::class)
            ->set('data.name', 'Gabriel R. Antunes')
            ->set('data.about_translations.en.fields.title', 'About')
            ->set('data.about_translations.pt-BR.fields.title', 'Sobre')
            ->call('save')
            ->assertHasNoErrors();

        Livewire::test(ManageResume::class)
            ->set('data.page_translations.en.fields.title', 'Résumé')
            ->set('data.page_translations.pt-BR.fields.title', 'Currículo')
            ->call('save')
            ->assertHasNoErrors();

        $about = Page::query()->where('slug', 'about')->firstOrFail();
        $resume = Page::query()->where('slug', 'resume')->firstOrFail();

        $this->assertSame('About', $about->currentRevision->translations()->where('locale', 'en')->value('title'));
        $this->assertSame('Sobre', $about->currentRevision->translations()->where('locale', 'pt-BR')->value('title'));
        $this->assertSame('Résumé', $resume->currentRevision->translations()->where('locale', 'en')->value('title'));
        $this->assertSame('Currículo', $resume->currentRevision->translations()->where('locale', 'pt-BR')->value('title'));
    }

    public function test_contact_manager_persists_settings_alongside_page_content(): void
    {
        $this->actingAsAdmin();

        Livewire::test(ManageContact::class)
            ->set('data.contact_email', 'contact@example.com')
            ->set('data.contact_enabled', true)
            ->set('data.contact_available', false)
            ->set('data.translations.en.fields.title', 'Contact')
            ->set('data.translations.pt-BR.fields.title', 'Contato')
            ->call('save')
            ->assertHasNoErrors();

        $settingsRevision = SiteSettings::query()->firstOrFail()->publishedRevision;

        $this->assertSame('contact@example.com', $settingsRevision->contact_email);
        $this->assertSame('Contact', Page::query()->where('slug', 'contact')->firstOrFail()->currentRevision->translations()->where('locale', 'en')->value('title'));
    }

    private function actingAsAdmin(): User
    {
        Config::set('services.keycloak.base_url', 'https://auth.test/realms/management');
        $user = User::factory()->create(['email' => 'admin@example.com']);
        $this->actingAs($user)->withSession([
            'admin_oidc_authorized' => true,
            'admin_oidc_expires_at' => now()->addHour()->timestamp,
            'admin_oidc_issuer' => 'https://auth.test/realms/management',
            'admin_oidc_subject' => 'admin-subject',
        ]);
        $user->update([
            'oidc_issuer' => 'https://auth.test/realms/management',
            'oidc_subject' => 'admin-subject',
        ]);

        return $user;
    }
}
